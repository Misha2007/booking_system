import express from "express";
import db from "../models/index.js";
import { Op } from "sequelize";
import { RoomController } from "../controllers/room.js";

const router = express.Router();

router.get("/hotel/:hotelId", async (req, res) => {
  try {
    const rooms = await db.RoomInfo.findAll({
      where: { hotelId: req.params.hotelId },
      include: [{ model: db.Room, as: "room" }],
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
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const allRoomInfos = await db.RoomInfo.findAll({
      where: { hotelId },
      include: [{ model: db.Room, as: "room" }],
    });

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

    const roomBookingCounts = {};
    bookedTrips.forEach((trip) => {
      const roomId = trip.roomId;
      roomBookingCounts[roomId] = (roomBookingCounts[roomId] || 0) + 1;
    });

    const availabilityInfo = allRoomInfos.map((roomInfo) => {
      const bookedCount = roomBookingCounts[roomInfo.roomId] || 0;
      const availableCount = Math.max(0, roomInfo.quantity - bookedCount);

      return {
        roomInfoId: roomInfo.id,
        roomId: roomInfo.roomId,
        roomType: roomInfo.room?.type,
        quantity: roomInfo.quantity,
        available: availableCount,
        details: roomInfo,
      };
    });

    res.json(availabilityInfo);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching availability", error: err.message });
  }
});

router.post("/hotel/add-room", async (req, res) =>
  RoomController.createRoom(req, res)
);

export default router;
