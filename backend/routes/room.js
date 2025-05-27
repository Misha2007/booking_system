import express from "express";
import db from "../models/index.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/hotel/:hotelId", async (req, res) => {
  try {
    const rooms = await db.Room.findAll({
      where: { hotelId: req.params.hotelId },
    });
    res.json(rooms);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: err.message });
  }
});

router.get("/hotel/:hotelId/available", async (req, res) => {
  const { from, to } = req.query;
  const { hotelId } = req.params;

  if (!from || !to) {
    return res.status(400).json({ message: "Missing date range" });
  }

  try {
    const allRooms = await db.Room.findAll({ where: { hotelId } });

    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    const bookedTrips = await db.Trip.findAll({
      where: {
        hotelId,
        [Op.and]: [
          { roomId: { [Op.ne]: null } },
          {
            departureDate: { [Op.lte]: toDate },
            arrivalDate: { [Op.gte]: fromDate },
          },
        ],
      },
    });

    console.log(from);

    console.log("booked trips", bookedTrips);
    // Make sure both are integers for comparison!
    const bookedRoomIds = bookedTrips.map((trip) => Number(trip.roomId));
    console.log("Booked room IDs:", bookedRoomIds);
    console.log(
      "All room IDs:",
      allRooms.map((r) => r.Room)
    );
    const availableRooms = allRooms.filter(
      (room) => !bookedRoomIds.includes(Number(room.Room))
    );

    res.json(availableRooms);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching available rooms", error: err.message });
  }
});

export default router;
