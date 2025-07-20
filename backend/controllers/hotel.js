import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import "../util/db.js";
import models from "../models/index.js";
import Region from "../models/region.js";
import RoomInfo from "../models/roominfo.js";

class hotelController {
  constructor() {
    this.HOTELS = [];
  }

  getHotels = async (req, res) => {
    try {
      const hotels = await Hotel.findAll();

      if (!hotels) {
        return res.status(404).json({ message: "Hotels not found" });
      }

      res.json({ hotels: hotels });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  getHotelById = async (req, res) => {
    try {
      const hotel = await Hotel.findByPk(req.params.hotelId);

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
}

export const HotelController = new hotelController();
