import models from "../models/index.js";

import "../util/db.js";

class tripController {
  constructor() {
    this.Trips = [];
  }

  createTrip = async (req, res) => {
    try {
      const { departureDate, arrivalDate, hotelId, regionId } = req.body;

      console.log(models.Trip);

      const newTrip = await models.Trip.create({
        departureDate,
        arrivalDate,
        hotelId,
        regionId,
        metadata: {
          product_name: "Deluxe Hotel Room",
          product_id: "abc123",
          nights: "3",
        },
      });

      res.status(201).json({
        message: "Trip created successfully",
        trip: newTrip,
      });

      console.log(`[Server]: New trip "${newTrip}" created`);
    } catch (err) {
      console.log(err.message);

      res.status(500).json({
        message: "Error creating trip",
        error: err.message,
      });
    }
  };

  getTrips = async (req, res) => {
    try {
      const trips = await models.Trips.findAll();
      console.log(trips);

      if (!trips) {
        return res.status(404).json({ message: "Trips not found" });
      }

      res.json({ trips: trips });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const TripController = new tripController();
