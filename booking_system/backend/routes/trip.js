import express, { Router } from "express";
import { TripController } from "../controllers/trip.js";

const router = Router();

router.post("/create", (req, res) => TripController.createTrip(req, res));
router.get("/get/:clientId", (req, res) => TripController.getTrips(req, res));

export default router;
