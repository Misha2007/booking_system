import express, { Router } from "express";
import { TripController } from "../controllers/trip.js";

const router = Router();

router.post("/create", (req, res) => TripController.createTrip(req, res));

export default router;
