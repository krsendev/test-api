/**
 * Middleware untuk otorisasi berdasarkan role.
 * Harus digunakan SETELAH middleware verifyToken (req.user harus sudah ada).
 *
 * Contoh penggunaan:
 *   router.post("/", verifyToken, authorizeRoles("admin", "operator"), controller.create);
 *
 * @param  {...string} roles - Daftar role yang diizinkan
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Akses ditolak. Silakan login terlebih dahulu." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Akses ditolak. Role '${req.user.role}' tidak memiliki izin untuk mengakses resource ini.`,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
