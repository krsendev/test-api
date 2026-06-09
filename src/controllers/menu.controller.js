const supabase = require("../config/supabase");

// GET /api/menu
exports.getMenus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("menu")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: "Gagal mengambil data menu", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// GET /api/menu/:id
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("menu")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "Menu tidak ditemukan", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// POST /api/menu
exports.createMenu = async (req, res) => {
  try {
    const { nama_menu, harga, deskripsi } = req.body;

    if (!nama_menu || harga === undefined) {
      return res.status(400).json({ message: "Field nama_menu dan harga wajib diisi" });
    }

    const { data, error } = await supabase
      .from("menu")
      .insert([{ nama_menu, harga, deskripsi }])
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menambahkan menu", error });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// PUT /api/menu/:id
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_menu, harga, deskripsi } = req.body;

    const { data, error } = await supabase
      .from("menu")
      .update({ nama_menu, harga, deskripsi })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal mengupdate menu", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// DELETE /api/menu/:id
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("menu")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menghapus menu", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }

    res.json({ message: "Menu berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
