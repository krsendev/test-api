const supabase = require("../config/supabase");
const pesananService = require("../services/pesanan.service");

// GET /api/pesanan
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("pesanan")
      .select("*")
      .order("tanggal_pesanan", { ascending: false });

    if (error) {
      return res.status(500).json({ message: "Gagal mengambil data pesanan", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// GET /api/pesanan/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("pesanan")
      .select("*, detail_pesanan(*, menu(id, nama_menu))")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// POST /api/pesanan
exports.create = async (req, res) => {
  try {
    const { pengguna_id, items } = req.body;

    if (!pengguna_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Field pengguna_id dan items (array) wajib diisi",
        format: {
          pengguna_id: 1,
          items: [{ menu_id: 1, qty: 2 }],
        },
      });
    }

    // Validasi setiap item memiliki menu_id dan qty
    for (const item of items) {
      if (!item.menu_id || !item.qty || item.qty < 1) {
        return res.status(400).json({
          message: "Setiap item harus memiliki menu_id dan qty (minimal 1)",
        });
      }
    }

    const result = await pesananService.createPesanan(pengguna_id, items);

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      data: result,
    });
  } catch (err) {
    // Jika error karena stok kurang, kirim detail stok yang kurang
    if (err.stokKurang) {
      return res.status(400).json({
        message: err.message,
        stok_kurang: err.stokKurang,
      });
    }

    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// PUT /api/pesanan/:id (update status pesanan)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "diproses", "selesai", "dibatalkan"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        message: `Status tidak valid. Gunakan salah satu: ${validStatus.join(", ")}`,
      });
    }

    const { data, error } = await supabase
      .from("pesanan")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal mengupdate pesanan", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// DELETE /api/pesanan/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Hapus detail pesanan terlebih dahulu (foreign key)
    await supabase.from("detail_pesanan").delete().eq("pesanan_id", id);

    const { data, error } = await supabase
      .from("pesanan")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menghapus pesanan", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    res.json({ message: "Pesanan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
