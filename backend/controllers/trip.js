import models from "../models/index.js";

import "../util/db.js";

class tripController {
  constructor() {
    this.Trips = [];
  }

  createTrip = async (req, res) => {
    console.log("Req body222:", req.body);
    try {
      const { departureDate, arrivalDate, clientId, hotelId, regionId, roomId } =
        req.body;

      const newTrip = await models.Trip.create({
        clientId,
        departureDate,
        arrivalDate,
        roomId,
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
      const trips = await models.Trip.findAll({
        where: {
          clientId: req.params.clientId,
        },
      });

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
