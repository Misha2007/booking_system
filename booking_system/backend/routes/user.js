import express, { Router } from "express";
import { UserController } from "../controllers/user.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.post("/new-user", (req, res) => UserController.createUser(req, res));
router.post("/login", (req, res) => UserController.getUser(req, res));
router.get("/profile", verifyToken, (req, res) => {
  console.log("verifyToken lõppes, nüüd UserController");
  UserController.getUserProfile(req, res);
});

export default router;
