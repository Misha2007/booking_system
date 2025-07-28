import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import "../util/db.js";
import models from "../models/index.js";
import RoomInfo from "../models/roominfo.js";

class roomController {
  constructor() {}

  createRoom = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { hotelId, roomType, roomName, capacity, basePrice, quantity } =
        req.body;
      const hotel = await Hotel.findByPk(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      const [room, created] = await Room.findOrCreate({
        where: { roomType, roomName },
      });
      const roomInfo = await RoomInfo.create({
        hotelId,
        roomId: room.roomId,
        capacity,
        basePrice,
        quantity,
      });
      const extendedRoomInfo = await RoomInfo.findByPk(roomInfo.id, {
        include: {
          model: Room,
          attributes: ["roomType", "roomName"],
          as: "room",
        },
      });
      return res.status(201).json({ roomInfo: extendedRoomInfo });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating room" });
    }
  };

  createImage = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { id, image, isCover } = req.body;
      const room = await RoomInfo.findByPk(id);
      if (!room) {
        return res.status(404).json({ message: "RoomInfo not found" });
      }
      const imageRoom = await Image.create({ roomInfoId: id, image, isCover });
      return res.status(201).json(imageRoom);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating image" });
    }
  };
}

export const RoomController = new roomController();
