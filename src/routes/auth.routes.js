const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/auth");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - email
 *               - password
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@mail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [admin, operator, customer]
 *                 default: customer
 *                 example: "customer"
 *     responses:
 *       201:
 *         description: Registrasi berhasil, mengembalikan data user dan token
 *       400:
 *         description: Data tidak lengkap
 *       409:
 *         description: Email sudah terdaftar
 */
router.post("/register", controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@mail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan data user dan token
 *       400:
 *         description: Data tidak lengkap
 *       401:
 *         description: Email atau password salah
 */
router.post("/login", controller.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Mengambil profil pengguna yang sedang login
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil profil
 *       401:
 *         description: Token tidak valid
 */
router.get("/profile", verifyToken, controller.getProfile);

module.exports = router;
