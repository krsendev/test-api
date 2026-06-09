const express = require("express");
const stockController = require("../controllers/stock.controller");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/role");

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: Menampilkan semua stok
 *     tags:
 *       - Stok
 *     responses:
 *       200:
 *         description: Berhasil mengambil data stok
 */
router.get("/", verifyToken, authorizeRoles("admin", "operator"), stockController.getStocks);

/**
 * @swagger
 * /api/stocks/{id}:
 *   get:
 *     summary: Menampilkan stok berdasarkan ID
 *     tags:
 *       - Stok
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID stok
 *     responses:
 *       200:
 *         description: Berhasil mengambil data stok
 *       404:
 *         description: Stok tidak ditemukan
 */
router.get("/:id", verifyToken, authorizeRoles("admin", "operator"), stockController.getStockById);

/**
 * @swagger
 * /api/stocks:
 *   post:
 *     summary: Menambah stok baru
 *     tags:
 *       - Stok
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_bahan
 *               - jumlah
 *               - satuan
 *             properties:
 *               nama_bahan:
 *                 type: string
 *                 example: "Gula"
 *               jumlah:
 *                 type: integer
 *                 example: 100
 *               satuan:
 *                 type: string
 *                 example: "kg"
 *     responses:
 *       201:
 *         description: Stok berhasil ditambahkan
 *       400:
 *         description: Data tidak lengkap
 */
router.post("/", verifyToken, authorizeRoles("admin", "operator"), stockController.createStock);

/**
 * @swagger
 * /api/stocks/{id}:
 *   put:
 *     summary: Mengupdate stok
 *     tags:
 *       - Stok
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID stok
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_bahan:
 *                 type: string
 *               jumlah:
 *                 type: integer
 *               satuan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stok berhasil diupdate
 *       404:
 *         description: Stok tidak ditemukan
 */
router.put("/:id", verifyToken, authorizeRoles("admin", "operator"), stockController.updateStock);

/**
 * @swagger
 * /api/stocks/{id}:
 *   delete:
 *     summary: Menghapus stok
 *     tags:
 *       - Stok
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID stok
 *     responses:
 *       200:
 *         description: Stok berhasil dihapus
 *       404:
 *         description: Stok tidak ditemukan
 */
router.delete("/:id", verifyToken, authorizeRoles("admin", "operator"), stockController.deleteStock);

module.exports = router;
