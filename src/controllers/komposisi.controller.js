const supabase = require("../config/supabase");

// GET /api/komposisi
exports.getAll = async (req, res) => {
  try {
    const { menu_id } = req.query;

    let query = supabase
      .from("komposisi")
      .select("*, menu(id, nama_menu), bahan_baku(id, nama_bahan, satuan)");

    if (menu_id) {
      query = query.eq("menu_id", menu_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ message: "Gagal mengambil data komposisi", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// GET /api/komposisi/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("komposisi")
      .select("*, menu(id, nama_menu), bahan_baku(id, nama_bahan, satuan)")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "Komposisi tidak ditemukan", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// POST /api/komposisi
exports.create = async (req, res) => {
  try {
    const { menu_id, bahan_baku_id, jumlah } = req.body;

    if (!menu_id || !bahan_baku_id || jumlah === undefined) {
      return res.status(400).json({ message: "Field menu_id, bahan_baku_id, dan jumlah wajib diisi" });
    }

    const { data, error } = await supabase
      .from("komposisi")
      .insert([{ menu_id, bahan_baku_id, jumlah }])
      .select("*, menu(id, nama_menu), bahan_baku(id, nama_bahan, satuan)");

    if (error) {
      return res.status(500).json({ message: "Gagal menambahkan komposisi", error });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// PUT /api/komposisi/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_id, bahan_baku_id, jumlah } = req.body;

    const { data, error } = await supabase
      .from("komposisi")
      .update({ menu_id, bahan_baku_id, jumlah })
      .eq("id", id)
      .select("*, menu(id, nama_menu), bahan_baku(id, nama_bahan, satuan)");

    if (error) {
      return res.status(500).json({ message: "Gagal mengupdate komposisi", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Komposisi tidak ditemukan" });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// DELETE /api/komposisi/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("komposisi")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menghapus komposisi", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Komposisi tidak ditemukan" });
    }

    res.json({ message: "Komposisi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
