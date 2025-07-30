import express, { Router } from "express";
import { ImageController } from "../controllers/image.js";
import { verifyToken } from "../middlewares/authJwt.js";
import { rolesSeparator } from "../middlewares/rolesSeparator.js";

const router = Router();

router.post("/upload", verifyToken, rolesSeparator, (req, res) =>
  ImageController.uploadImage(req, res)
);

router.get(
  "/get-by-hotelId/:hotelId",
  verifyToken,
  rolesSeparator,
  (req, res) => ImageController.getImagesByHotelId(req, res)
);
router.delete(
  "/delete/:imageId",
  verifyToken,
  rolesSeparator,
  ImageController.deleteImage
);
router.patch(
  "/set-cover/:imageId",
  verifyToken,
  rolesSeparator,
  ImageController.setCoverImage
);

export default router;
