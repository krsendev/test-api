const supabase = require("../config/supabase");

// GET /api/bahan-baku
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("bahan_baku")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: "Gagal mengambil data bahan baku", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// GET /api/bahan-baku/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("bahan_baku")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "Bahan baku tidak ditemukan", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// POST /api/bahan-baku
exports.create = async (req, res) => {
  try {
    const { nama_bahan, stok, satuan } = req.body;

    if (!nama_bahan || stok === undefined || !satuan) {
      return res.status(400).json({ message: "Field nama_bahan, stok, dan satuan wajib diisi" });
    }

    const { data, error } = await supabase
      .from("bahan_baku")
      .insert([{ nama_bahan, stok, satuan }])
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menambahkan bahan baku", error });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// PUT /api/bahan-baku/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_bahan, stok, satuan } = req.body;

    const { data, error } = await supabase
      .from("bahan_baku")
      .update({ nama_bahan, stok, satuan })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal mengupdate bahan baku", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Bahan baku tidak ditemukan" });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// DELETE /api/bahan-baku/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("bahan_baku")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menghapus bahan baku", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Bahan baku tidak ditemukan" });
    }

    res.json({ message: "Bahan baku berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
