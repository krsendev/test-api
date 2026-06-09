const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu.controller");
const verifyToken = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/role");

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Menampilkan semua menu (publik)
 *     tags:
 *       - Menu
 *     responses:
 *       200:
 *         description: Berhasil mengambil data menu
 */
router.get("/", menuController.getMenus);

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Menampilkan menu berdasarkan ID
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Berhasil mengambil data menu
 *       404:
 *         description: Menu tidak ditemukan
 */
router.get("/:id", menuController.getMenuById);

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Menambahkan menu baru (admin/operator)
 *     tags:
 *       - Menu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_menu
 *               - harga
 *             properties:
 *               nama_menu:
 *                 type: string
 *                 example: "Nasi Ayam Bakar"
 *               harga:
 *                 type: number
 *                 example: 25000
 *               deskripsi:
 *                 type: string
 *                 example: "Nasi dengan ayam bakar dan sambal"
 *     responses:
 *       201:
 *         description: Menu berhasil ditambahkan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Tidak memiliki akses
 */
router.post("/", verifyToken, authorizeRoles("admin", "operator"), menuController.createMenu);

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Mengupdate menu (admin/operator)
 *     tags:
 *       - Menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_menu:
 *                 type: string
 *                 example: "Nasi Ayam Bakar"
 *               harga:
 *                 type: number
 *                 example: 30000
 *               deskripsi:
 *                 type: string
 *                 example: "Nasi dengan ayam bakar spesial"
 *     responses:
 *       200:
 *         description: Menu berhasil diupdate
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Menu tidak ditemukan
 */
router.put("/:id", verifyToken, authorizeRoles("admin", "operator"), menuController.updateMenu);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Menghapus menu (admin/operator)
 *     tags:
 *       - Menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID menu
 *     responses:
 *       200:
 *         description: Menu berhasil dihapus
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Menu tidak ditemukan
 */
router.delete("/:id", verifyToken, authorizeRoles("admin", "operator"), menuController.deleteMenu);

module.exports = router;
