import express, { Router } from "express";
import { CountryController } from "../controllers/country.js";

const router = Router();

router.get("/by/:country", (req, res) =>
  CountryController.getHotelsByRegion(req, res)
);
router.get("/all", (req, res) => CountryController.getHotels(req, res));
export default router;
