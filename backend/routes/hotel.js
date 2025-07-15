import express, { Router } from "express";
import { HotelController } from "../controllers/hotel.js";

const router = Router();

router.get("/hotels", (req, res) => HotelController.getHotels(req, res));
router.get("/hotel/:hotelId", (req, res) =>
  HotelController.getHotelById(req, res)
);
router.get("/hotel-admin/:hotelId", (req, res) =>
  HotelController.getHotelByIdAdmin(req, res)
);

export default router;
