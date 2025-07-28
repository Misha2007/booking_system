import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import "../util/db.js";
import models from "../models/index.js";
import Region from "../models/region.js";
import RoomInfo from "../models/roominfo.js";
import Image from "../models/image.js";
import db from "../models/index.js";
import { Op } from "sequelize";

class hotelController {
  constructor() {
    this.HOTELS = [];
  }

  getHotels = async (req, res) => {
    try {
      const hotels = await Hotel.findAll({
        include: [{ model: Region, as: "region" }, Image],
      });

      if (!hotels) {
        return res.status(404).json({ message: "Hotels not found" });
      }

      res.json({ hotels: hotels });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  getAvailableHotels = async (req, res) => {
    try {
      const { from, to, country } = req.query;

      if (!from || !to || !country) {
        return res
          .status(400)
          .json({ message: "fromDate and toDate are required" });
      }

      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      const hotels = await Hotel.findAll({
        include: [
          { model: RoomInfo, as: "roomInfos" },
          {
            model: Region,
            as: "region",
            where: {
              countryName: country,
            },
            required: true,
          },
          Image,
        ],
      });

      if (!hotels) {
        return res.status(404).json({ message: "Hotels not found" });
      }

      const bookedTrips = await db.Trip.findAll({
        where: {
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

      const availabilityInfo = hotels.map((hotel) => {
        const roomsAvailability = hotel.roomInfos.map((roomInfo) => {
          const bookedCount = roomBookingCounts[roomInfo.roomId] || 0;
          const availableCount = Math.max(0, roomInfo.quantity - bookedCount);

          return {
            hotelId: hotel.id,
            hotelName: hotel.name,
            roomInfoId: roomInfo.id,
            roomId: roomInfo.roomId,
            roomType: roomInfo.room?.type,
            quantity: roomInfo.quantity,
            available: availableCount,
            details: roomInfo,
          };
        });

        return {
          hotelId: hotel.hotelId,
          hotelName: hotel.name,
          hotelRating: hotel.hotelRating,
          availableRooms: roomsAvailability,
          region: hotel.region,
          images: hotel.Images,
        };
      });

      res.json(availabilityInfo);
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  getHotelById = async (req, res) => {
    try {
      const hotel = await Hotel.findByPk(req.params.hotelId, {
        include: [
          { model: RoomInfo, as: "roomInfos" },
          { model: Region, as: "region" },
          Image,
        ],
      });

      for (let i = 0; i < hotel.roomInfos.length; i++) {
        const room = hotel.roomInfos[i];
        const roomInfo = await RoomInfo.findByPk(room.id, {
          include: [{ model: Room, as: "room" }],
        });
        hotel.roomInfos[i] = roomInfo;
      }

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      res.json({ hotel: hotel });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  getHotelByIdAdmin = async (req, res) => {
    try {
      const hotel = await Hotel.findByPk(req.params.hotelId, {
        include: [
          { model: RoomInfo, as: "roomInfos" },
          { model: Region, as: "region" },
        ],
      });
      for (let i = 0; i < hotel.roomInfos.length; i++) {
        const room = hotel.roomInfos[i];
        const roomInfo = await RoomInfo.findByPk(room.id, {
          include: [{ model: Room, as: "room" }],
        });
        hotel.roomInfos[i] = roomInfo;
      }
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      res.json({ hotel: hotel });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  imageCreate = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      const hotel = await Hotel.findByPk(req.params.hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      const image = await Image.create({
        url: req.body.url,
        hotelId: req.params.hotelId,
        isCover: req.body.isCover,
      });
      res.json({ image: image });
    } catch (err) {
      console.error("Error creating image", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const HotelController = new hotelController();
