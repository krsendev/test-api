const jwt = require("jsonwebtoken");

/**
 * Middleware untuk memverifikasi JWT token.
 * Token diambil dari header: Authorization: Bearer <token>
 * Jika valid, data user disimpan ke req.user
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token sudah kadaluarsa. Silakan login kembali." });
    }
    return res.status(401).json({ message: "Token tidak valid." });
  }
};

module.exports = verifyToken;
