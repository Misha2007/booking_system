import express, { Router } from "express";
import { HotelController } from "../controllers/hotel.js";
import { verifyToken } from "../middlewares/authJwt.js";
import { rolesSeparator } from "../middlewares/rolesSeparator.js";

const router = Router();

router.get("/hotels", (req, res) => HotelController.getHotels(req, res));
router.get("/hotel/:hotelId", (req, res) =>
  HotelController.getHotelById(req, res)
);
router.get("/hotel-admin/:hotelId", verifyToken, rolesSeparator, (req, res) =>
  HotelController.getHotelByIdAdmin(req, res)
);

router.post(
  "/hotel-admin/image-create/:hotelId",
  verifyToken,
  rolesSeparator,
  (req, res) => HotelController.imageCreate(req, res)
);

router.get(`/hotels/available`, (req, res) =>
  HotelController.getAvailableHotels(req, res)
);

export default router;
