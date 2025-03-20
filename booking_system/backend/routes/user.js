import express, { Router } from "express";
import { UserController } from "../controllers/user.js";

const router = Router();

router.post("/new-user", (req, res) => UserController.createUser(req, res));
router.post("/login", (req, res) => UserController.getUser(req, res));

export default router;
