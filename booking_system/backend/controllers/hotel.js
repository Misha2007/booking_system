import Hotel from "../models/hotel.js";
import "../util/db.js";

class hotelController {
  constructor() {
    this.HOTELS = [];
  }

  getHotels = async (req, res) => {
    try {
      const hotels = await Hotel.findAll();
      console.log(hotels);

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
}

export const HotelController = new hotelController();
