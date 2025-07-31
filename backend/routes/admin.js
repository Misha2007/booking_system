import express, { Router } from "express";
import { verifyToken } from "../middlewares/authJwt.js";
import { rolesSeparator } from "../middlewares/rolesSeparator.js";
import { AdminController } from "../controllers/admin.js";

const router = Router();

router.get("/getHeaderData", verifyToken, rolesSeparator, (req, res) =>
  AdminController.getHeaderData(req, res)
);

export default router;
