const express = require("express");
const router = express.Router();
const controller = require("../controllers/bahan.controller");
const verifyToken = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/role");

/**
 * @swagger
 * /api/bahan-baku:
 *   get:
 *     summary: Menampilkan semua bahan baku (admin/operator)
 *     tags:
 *       - Bahan Baku
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data bahan baku
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Tidak memiliki akses
 */
router.get("/", verifyToken, authorizeRoles("admin", "operator"), controller.getAll);

/**
 * @swagger
 * /api/bahan-baku/{id}:
 *   get:
 *     summary: Menampilkan bahan baku berdasarkan ID
 *     tags:
 *       - Bahan Baku
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bahan baku
 *     responses:
 *       200:
 *         description: Berhasil mengambil data bahan baku
 *       404:
 *         description: Bahan baku tidak ditemukan
 */
router.get("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.getById);

/**
 * @swagger
 * /api/bahan-baku:
 *   post:
 *     summary: Menambahkan bahan baku baru
 *     tags:
 *       - Bahan Baku
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_bahan
 *               - stok
 *               - satuan
 *             properties:
 *               nama_bahan:
 *                 type: string
 *                 example: "Beras"
 *               stok:
 *                 type: number
 *                 example: 5000
 *               satuan:
 *                 type: string
 *                 example: "gram"
 *     responses:
 *       201:
 *         description: Bahan baku berhasil ditambahkan
 *       400:
 *         description: Data tidak lengkap
 */
router.post("/", verifyToken, authorizeRoles("admin", "operator"), controller.create);

/**
 * @swagger
 * /api/bahan-baku/{id}:
 *   put:
 *     summary: Mengupdate bahan baku
 *     tags:
 *       - Bahan Baku
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bahan baku
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_bahan:
 *                 type: string
 *               stok:
 *                 type: number
 *               satuan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bahan baku berhasil diupdate
 *       404:
 *         description: Bahan baku tidak ditemukan
 */
router.put("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.update);

/**
 * @swagger
 * /api/bahan-baku/{id}:
 *   delete:
 *     summary: Menghapus bahan baku
 *     tags:
 *       - Bahan Baku
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bahan baku
 *     responses:
 *       200:
 *         description: Bahan baku berhasil dihapus
 *       404:
 *         description: Bahan baku tidak ditemukan
 */
router.delete("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.remove);

module.exports = router;
