import express, { Router } from "express";
import { ImageController } from "../controllers/image.js";
import { verifyToken } from "../middlewares/authJwt.js";
import { rolesSeparator } from "../middlewares/rolesSeparator.js";

const router = Router();

router.post("/upload", verifyToken, rolesSeparator, (req, res) =>
  ImageController.uploadImage(req, res)
);
export default router;
