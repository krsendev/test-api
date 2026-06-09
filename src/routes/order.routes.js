const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");
const verifyToken = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/role");

/**
 * @swagger
 * /api/pesanan:
 *   get:
 *     summary: Menampilkan semua pesanan
 *     tags:
 *       - Pesanan
 *     responses:
 *       200:
 *         description: Berhasil mengambil data pesanan
 */
router.get("/", verifyToken, controller.getAll);

/**
 * @swagger
 * /api/pesanan/{id}:
 *   get:
 *     summary: Menampilkan pesanan berdasarkan ID (termasuk detail pesanan)
 *     tags:
 *       - Pesanan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesanan
 *     responses:
 *       200:
 *         description: Berhasil mengambil data pesanan
 *       404:
 *         description: Pesanan tidak ditemukan
 */
router.get("/:id", verifyToken, controller.getById);

/**
 * @swagger
 * /api/pesanan:
 *   post:
 *     summary: Membuat pesanan baru (otomatis mengurangi stok bahan baku)
 *     tags:
 *       - Pesanan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pengguna_id
 *               - items
 *             properties:
 *               pengguna_id:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - menu_id
 *                     - qty
 *                   properties:
 *                     menu_id:
 *                       type: integer
 *                       example: 1
 *                     qty:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pesanan berhasil dibuat
 *       400:
 *         description: Data tidak valid atau stok tidak mencukupi
 */
router.post("/", verifyToken, controller.create);

/**
 * @swagger
 * /api/pesanan/{id}:
 *   put:
 *     summary: Mengupdate status pesanan
 *     tags:
 *       - Pesanan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesanan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, diproses, selesai, dibatalkan]
 *                 example: "diproses"
 *     responses:
 *       200:
 *         description: Status pesanan berhasil diupdate
 *       400:
 *         description: Status tidak valid
 *       404:
 *         description: Pesanan tidak ditemukan
 */
router.put("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.update);

/**
 * @swagger
 * /api/pesanan/{id}:
 *   delete:
 *     summary: Menghapus pesanan (termasuk detail pesanan)
 *     tags:
 *       - Pesanan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pesanan
 *     responses:
 *       200:
 *         description: Pesanan berhasil dihapus
 *       404:
 *         description: Pesanan tidak ditemukan
 */
router.delete("/:id", verifyToken, authorizeRoles("admin", "operator"), controller.remove);

module.exports = router;
