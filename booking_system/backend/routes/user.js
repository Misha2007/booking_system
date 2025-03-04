import express, { Router } from "express";
import { UserController } from "../controllers/user.js";

const router = Router();

router.post("/new-user", (req, res) => UserController.createUser(req, res));

export default router;
