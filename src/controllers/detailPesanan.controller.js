const supabase = require("../config/supabase");

// GET /api/detail-pesanan?pesanan_id=1
exports.getAll = async (req, res) => {
  try {
    const { pesanan_id } = req.query;

    let query = supabase
      .from("detail_pesanan")
      .select("*, menu(id, nama_menu)");

    if (pesanan_id) {
      query = query.eq("pesanan_id", pesanan_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ message: "Gagal mengambil data detail pesanan", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// POST /api/detail-pesanan
exports.create = async (req, res) => {
  try {
    const { pesanan_id, menu_id, qty } = req.body;

    if (!pesanan_id || !menu_id || !qty) {
      return res.status(400).json({ message: "Field pesanan_id, menu_id, dan qty wajib diisi" });
    }

    // Ambil harga menu
    const { data: menu, error: menuError } = await supabase
      .from("menu")
      .select("harga")
      .eq("id", menu_id)
      .single();

    if (menuError) {
      return res.status(404).json({ message: "Menu tidak ditemukan", error: menuError });
    }

    const subtotal = menu.harga * qty;

    const { data, error } = await supabase
      .from("detail_pesanan")
      .insert([{ pesanan_id, menu_id, qty, harga: menu.harga, subtotal }])
      .select("*, menu(id, nama_menu)");

    if (error) {
      return res.status(500).json({ message: "Gagal menambahkan detail pesanan", error });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// PUT /api/detail-pesanan/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;

    if (!qty || qty < 1) {
      return res.status(400).json({ message: "Field qty wajib diisi (minimal 1)" });
    }

    // Ambil detail pesanan yang ada untuk mendapatkan harga
    const { data: existing, error: existError } = await supabase
      .from("detail_pesanan")
      .select("harga")
      .eq("id", id)
      .single();

    if (existError) {
      return res.status(404).json({ message: "Detail pesanan tidak ditemukan", error: existError });
    }

    const subtotal = existing.harga * qty;

    const { data, error } = await supabase
      .from("detail_pesanan")
      .update({ qty, subtotal })
      .eq("id", id)
      .select("*, menu(id, nama_menu)");

    if (error) {
      return res.status(500).json({ message: "Gagal mengupdate detail pesanan", error });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// DELETE /api/detail-pesanan/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("detail_pesanan")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menghapus detail pesanan", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Detail pesanan tidak ditemukan" });
    }

    res.json({ message: "Detail pesanan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
