const express = require("express");
const router = express.Router();
const controller = require("../controllers/detailPesanan.controller");
const verifyToken = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/role");

/**
 * @swagger
 * /api/detail-pesanan:
 *   get:
 *     summary: Menampilkan semua detail pesanan
 *     tags:
 *       - Detail Pesanan
 *     parameters:
 *       - in: query
 *         name: pesanan_id
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan pesanan ID
 *     responses:
 *       200:
 *         description: Berhasil mengambil data detail pesanan
 */
router.get("/", verifyToken, authorizeRoles("admin", "operator"), controller.getAll);

/**
 * @swagger
 * /api/detail-pesanan:
 *   post:
 *     summary: Menambahkan detail pesanan baru
 *     tags:
 *       - Detail Pesanan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pesanan_id
 *               - menu_id
 *               - qty
 *             properties:
 *               pesanan_id:
 *                 type: integer
 *                 example: 1
 *               menu_id:
 *                 type: integer
 *                 example: 1
 *               qty:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Detail pesanan berhasil ditambahkan
 *       400:
 *         description: Data tidak lengkap
 *       404:
 *         description: Menu tidak ditemukan
 */
router.post("/", verifyToken, authorizeRoles("admin", "operator"), controller.create);

/**
 * @swagger
 * /api/detail-pesanan/{id}:
 *   put:
 *     summary: Mengupdate qty detail pesanan
 *     tags:
 *       - Detail Pesanan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID detail pesanan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qty
 *             properties:
 *               qty:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Detail pesanan berhasil diupdate
 *       400:
 *         description: Qty tidak valid
 *       404:
 *         description: Detail pesanan tidak ditemukan
 */
router.put("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.update);

/**
 * @swagger
 * /api/detail-pesanan/{id}:
 *   delete:
 *     summary: Menghapus detail pesanan
 *     tags:
 *       - Detail Pesanan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID detail pesanan
 *     responses:
 *       200:
 *         description: Detail pesanan berhasil dihapus
 *       404:
 *         description: Detail pesanan tidak ditemukan
 */
router.delete("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.remove);

module.exports = router;
