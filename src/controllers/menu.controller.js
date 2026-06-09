const supabase = require("../config/supabase");

exports.getMenus = async (req, res) => {
  const { data, error } = await supabase.from("menu").select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};

exports.createMenu = async (req, res) => {
  const { nama_menu, harga, deskripsi, stok_dibutuhkan } = req.body;
  const { data, error } = await supabase
    .from("menu")
    .insert([
      {
        nama_menu,
        harga,
        deskripsi,
        stok_dibutuhkan,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};
