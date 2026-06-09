const supabase = require("../config/supabase");

/**
 * Service untuk business logic pesanan.
 *
 * Flow saat membuat pesanan:
 * 1. Simpan pesanan (status: pending)
 * 2. Ambil harga menu dari database
 * 3. Simpan detail pesanan (hitung subtotal)
 * 4. Ambil komposisi dari setiap menu yang dipesan
 * 5. Hitung kebutuhan total bahan baku
 * 6. Validasi ketersediaan stok
 * 7. Kurangi stok bahan baku
 * 8. Simpan log stok (tipe: keluar)
 * 9. Update total_harga pesanan
 */

/**
 * Membuat pesanan baru beserta detail, pengurangan stok, dan log stok.
 *
 * @param {number} pengguna_id - ID pengguna yang memesan
 * @param {Array<{menu_id: number, qty: number}>} items - Daftar menu yang dipesan
 * @returns {Object} Data pesanan lengkap dengan detail
 */
exports.createPesanan = async (pengguna_id, items) => {
  // ============================================================
  // STEP 1: Simpan pesanan dengan status pending dan total_harga 0
  // ============================================================
  const { data: pesanan, error: pesananError } = await supabase
    .from("pesanan")
    .insert([{
      pengguna_id,
      tanggal_pesanan: new Date().toISOString(),
      status: "pending",
      total_harga: 0,
    }])
    .select()
    .single();

  if (pesananError) {
    throw new Error(`Gagal menyimpan pesanan: ${pesananError.message}`);
  }

  // ============================================================
  // STEP 2: Ambil data harga menu dari database
  // ============================================================
  const menuIds = items.map((item) => item.menu_id);

  const { data: menus, error: menuError } = await supabase
    .from("menu")
    .select("id, nama_menu, harga")
    .in("id", menuIds);

  if (menuError) {
    throw new Error(`Gagal mengambil data menu: ${menuError.message}`);
  }

  // Validasi semua menu_id ditemukan
  const menuMap = {};
  menus.forEach((m) => {
    menuMap[m.id] = m;
  });

  for (const item of items) {
    if (!menuMap[item.menu_id]) {
      throw new Error(`Menu dengan ID ${item.menu_id} tidak ditemukan`);
    }
  }

  // ============================================================
  // STEP 3: Simpan detail pesanan
  // ============================================================
  let totalHarga = 0;

  const detailRows = items.map((item) => {
    const menu = menuMap[item.menu_id];
    const subtotal = menu.harga * item.qty;
    totalHarga += subtotal;

    return {
      pesanan_id: pesanan.id,
      menu_id: item.menu_id,
      qty: item.qty,
      harga: menu.harga,
      subtotal,
    };
  });

  const { data: detailPesanan, error: detailError } = await supabase
    .from("detail_pesanan")
    .insert(detailRows)
    .select();

  if (detailError) {
    throw new Error(`Gagal menyimpan detail pesanan: ${detailError.message}`);
  }

  // ============================================================
  // STEP 4: Ambil komposisi dari setiap menu yang dipesan
  // ============================================================
  const { data: komposisiList, error: komposisiError } = await supabase
    .from("komposisi")
    .select("menu_id, bahan_baku_id, jumlah")
    .in("menu_id", menuIds);

  if (komposisiError) {
    throw new Error(`Gagal mengambil data komposisi: ${komposisiError.message}`);
  }

  // ============================================================
  // STEP 5: Hitung kebutuhan total bahan baku
  // ============================================================
  // Map: bahan_baku_id -> total jumlah yang dibutuhkan
  const kebutuhanBahanBaku = {};

  for (const item of items) {
    const komposisiMenu = komposisiList.filter((k) => k.menu_id === item.menu_id);

    for (const komp of komposisiMenu) {
      const totalKebutuhan = komp.jumlah * item.qty;

      if (kebutuhanBahanBaku[komp.bahan_baku_id]) {
        kebutuhanBahanBaku[komp.bahan_baku_id] += totalKebutuhan;
      } else {
        kebutuhanBahanBaku[komp.bahan_baku_id] = totalKebutuhan;
      }
    }
  }

  // ============================================================
  // STEP 6: Validasi ketersediaan stok
  // ============================================================
  const bahanBakuIds = Object.keys(kebutuhanBahanBaku).map(Number);

  if (bahanBakuIds.length > 0) {
    const { data: stokList, error: stokError } = await supabase
      .from("bahan_baku")
      .select("id, nama_bahan, stok")
      .in("id", bahanBakuIds);

    if (stokError) {
      throw new Error(`Gagal mengambil data stok: ${stokError.message}`);
    }

    const stokMap = {};
    stokList.forEach((s) => {
      stokMap[s.id] = s;
    });

    // Cek apakah ada stok yang kurang
    const stokKurang = [];
    for (const [bahanId, jumlahDibutuhkan] of Object.entries(kebutuhanBahanBaku)) {
      const bahan = stokMap[Number(bahanId)];
      if (!bahan) {
        stokKurang.push({ bahan_baku_id: Number(bahanId), message: "Bahan baku tidak ditemukan" });
      } else if (bahan.stok < jumlahDibutuhkan) {
        stokKurang.push({
          bahan_baku_id: Number(bahanId),
          nama_bahan: bahan.nama_bahan,
          stok_tersedia: bahan.stok,
          stok_dibutuhkan: jumlahDibutuhkan,
        });
      }
    }

    if (stokKurang.length > 0) {
      // Rollback: hapus detail pesanan dan pesanan
      await supabase.from("detail_pesanan").delete().eq("pesanan_id", pesanan.id);
      await supabase.from("pesanan").delete().eq("id", pesanan.id);

      const error = new Error("Stok bahan baku tidak mencukupi");
      error.stokKurang = stokKurang;
      throw error;
    }

    // ============================================================
    // STEP 7: Kurangi stok bahan baku
    // ============================================================
    for (const [bahanId, jumlahDibutuhkan] of Object.entries(kebutuhanBahanBaku)) {
      const bahan = stokMap[Number(bahanId)];
      const stokBaru = bahan.stok - jumlahDibutuhkan;

      const { error: updateError } = await supabase
        .from("bahan_baku")
        .update({ stok: stokBaru })
        .eq("id", Number(bahanId));

      if (updateError) {
        throw new Error(`Gagal mengurangi stok bahan baku ID ${bahanId}: ${updateError.message}`);
      }
    }

    // ============================================================
    // STEP 8: Simpan log stok (tipe: keluar)
    // ============================================================
    const logRows = Object.entries(kebutuhanBahanBaku).map(([bahanId, jumlah]) => ({
      bahan_baku_id: Number(bahanId),
      jumlah,
      tipe: "keluar",
      keterangan: `Pesanan #${pesanan.id}`,
      created_at: new Date().toISOString(),
    }));

    const { error: logError } = await supabase
      .from("log_stok")
      .insert(logRows);

    if (logError) {
      throw new Error(`Gagal menyimpan log stok: ${logError.message}`);
    }
  }

  // ============================================================
  // STEP 9: Update total_harga pesanan
  // ============================================================
  const { data: updatedPesanan, error: updatePesananError } = await supabase
    .from("pesanan")
    .update({ total_harga: totalHarga })
    .eq("id", pesanan.id)
    .select()
    .single();

  if (updatePesananError) {
    throw new Error(`Gagal mengupdate total harga pesanan: ${updatePesananError.message}`);
  }

  return {
    pesanan: updatedPesanan,
    detail_pesanan: detailPesanan,
  };
};
