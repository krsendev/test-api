const express = require("express");
const router = express.Router();
const controller = require("../controllers/komposisi.controller");
const verifyToken = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/role");

/**
 * @swagger
 * /api/komposisi:
 *   get:
 *     summary: Menampilkan semua komposisi menu
 *     tags:
 *       - Komposisi
 *     parameters:
 *       - in: query
 *         name: menu_id
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan menu ID
 *     responses:
 *       200:
 *         description: Berhasil mengambil data komposisi
 */
router.get("/", verifyToken, authorizeRoles("admin", "operator"), controller.getAll);

/**
 * @swagger
 * /api/komposisi/{id}:
 *   get:
 *     summary: Menampilkan komposisi berdasarkan ID
 *     tags:
 *       - Komposisi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID komposisi
 *     responses:
 *       200:
 *         description: Berhasil mengambil data komposisi
 *       404:
 *         description: Komposisi tidak ditemukan
 */
router.get("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.getById);

/**
 * @swagger
 * /api/komposisi:
 *   post:
 *     summary: Menambahkan komposisi baru
 *     tags:
 *       - Komposisi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_id
 *               - bahan_baku_id
 *               - jumlah
 *             properties:
 *               menu_id:
 *                 type: integer
 *                 example: 1
 *               bahan_baku_id:
 *                 type: integer
 *                 example: 2
 *               jumlah:
 *                 type: number
 *                 example: 200
 *     responses:
 *       201:
 *         description: Komposisi berhasil ditambahkan
 *       400:
 *         description: Data tidak lengkap
 */
router.post("/", verifyToken, authorizeRoles("admin", "operator"), controller.create);

/**
 * @swagger
 * /api/komposisi/{id}:
 *   put:
 *     summary: Mengupdate komposisi
 *     tags:
 *       - Komposisi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID komposisi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menu_id:
 *                 type: integer
 *               bahan_baku_id:
 *                 type: integer
 *               jumlah:
 *                 type: number
 *     responses:
 *       200:
 *         description: Komposisi berhasil diupdate
 *       404:
 *         description: Komposisi tidak ditemukan
 */
router.put("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.update);

/**
 * @swagger
 * /api/komposisi/{id}:
 *   delete:
 *     summary: Menghapus komposisi
 *     tags:
 *       - Komposisi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID komposisi
 *     responses:
 *       200:
 *         description: Komposisi berhasil dihapus
 *       404:
 *         description: Komposisi tidak ditemukan
 */
router.delete("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.remove);

module.exports = router;
