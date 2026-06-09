const supabase = require("../config/supabase");

// GET /api/stocks
exports.getStocks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("stok")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({ message: "Gagal mengambil data stok", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// GET /api/stocks/:id
exports.getStockById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("stok")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "Stok tidak ditemukan", error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// POST /api/stocks
exports.createStock = async (req, res) => {
  try {
    const { nama_bahan, jumlah, satuan } = req.body;

    if (!nama_bahan || jumlah === undefined || !satuan) {
      return res.status(400).json({ message: "Field nama_bahan, jumlah, dan satuan wajib diisi" });
    }

    const { data, error } = await supabase
      .from("stok")
      .insert([{ nama_bahan, jumlah, satuan }])
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menambahkan stok", error });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// PUT /api/stocks/:id
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_bahan, jumlah, satuan } = req.body;

    const { data, error } = await supabase
      .from("stok")
      .update({ nama_bahan, jumlah, satuan })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal mengupdate stok", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Stok tidak ditemukan" });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// DELETE /api/stocks/:id
exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("stok")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: "Gagal menghapus stok", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Stok tidak ditemukan" });
    }

    res.json({ message: "Stok berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
