import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import "../util/db.js";
import models from "../models/index.js";

class roomController {
  constructor() {}

  createRoom = async (req, res) => {
    try {
      const { hotelId, roomType, roomName } = req.body;
      const hotel = await Hotel.findByPk(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      const room = await Room.create({ hotelId, roomType, roomName });
      return res.status(201).json(room);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating room" });
    }
  };
}

export const RoomController = new roomController();
