import express, { Router } from "express";
import { UserController } from "../controllers/user.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

/**
@swagger
 * components:
 *   schemas:
 *     Clients:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         clientId:
 *           type: integer
 *           description: Auto-generated ID
 *         firstName:
 *           type: string
 *           description: User's firstname
 *         lastName:
 *           type: string
 *           description: User's lastName
 *         email:
 *           type: string
 *           description: User's email
 *         phoneNumber:
 *           type: number
 *           format: int
 *           description: User's phone number
 *         password:
 *           type: string
 *           maxLength: 255
 *           description: User's password
 *         cardId:
 *           type: number
 *           format: int
 *           description: User's phone number
 *       example:
 *         clientId: 1
 *         firstName: John
 *         lastName: Smith
 *         email: john.smith@voco.ee
 *         phoneNumber: 12345678
 *         password: qwerty
 *         cardId: 1
 */ /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Clients:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         clientId:
 *           type: integer
 *           description: Auto-generated ID
 *         firstName:
 *           type: string
 *           description: User's firstname
 *         lastName:
 *           type: string
 *           description: User's lastName
 *         email:
 *           type: string
 *           description: User's email
 *         phoneNumber:
 *           type: number
 *           format: int
 *           description: User's phone number
 *         password:
 *           type: string
 *           maxLength: 255
 *           description: User's password
 *         cardId:
 *           type: number
 *           format: int
 *           description: User's phone number
 *       example:
 *         clientId: 1
 *         firstName: John
 *         lastName: Smith
 *         email: john.smith@voco.ee
 *         phoneNumber: 12345678
 *         password: qwerty
 *         cardId: 1
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get all users
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clients'
 *
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [Clients]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *
 * /user/new-user:
 *   post:
 *     summary: Login user
 *     tags: [Clients]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *
 *
 * /user/profile/edit:
 *   patch:
 *     summary: Edit user
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *
 * /user/delete:
 *   delete:
 *     summary: Edit user
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delete account
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clients'
 */

router.post("/new-user", (req, res) => UserController.createUser(req, res));
router.post("/login", (req, res) => UserController.getUser(req, res));
router.get("/profile", verifyToken, (req, res) => {
  UserController.getUserProfile(req, res);
});
router.patch("/profile/edit", verifyToken, (req, res) => {
  UserController.editUser(req, res);
});

router.delete("/delete", (req, res, next) => {
  console.log("DELETE /user/delete route hit");
  next();
}, verifyToken, (req, res) => {
  console.log("verifyToken passed");
  UserController.deleteUser(req, res);
});

export default router;
