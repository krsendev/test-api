const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
      return res
        .status(400)
        .json({ message: "Field nama, email, dan password wajib diisi" });
    }

    // Cek apakah email sudah terdaftar
    const { data: existingUser } = await supabase
      .from("pengguna")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru (default role: customer)
    const { data, error } = await supabase
      .from("pengguna")
      .insert([
        {
          nama,
          email,
          password: hashedPassword,
          role: role || "customer",
        },
      ])
      .select("id, nama, email, role");

    if (error) {
      return res
        .status(500)
        .json({ message: "Gagal mendaftarkan pengguna", error });
    }

    const user = data[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.status(201).json({
      message: "Registrasi berhasil",
      user,
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Field email dan password wajib diisi" });
    }

    // Cari user berdasarkan email
    const { data: user, error } = await supabase
      .from("pengguna")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("pengguna")
      .select("id, nama, email, role")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
