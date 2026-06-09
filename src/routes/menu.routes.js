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

module.exports = router;
