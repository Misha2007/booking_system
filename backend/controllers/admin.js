import "../util/db.js";
import models from "../models/index.js";
import sequelize from "../util/db.js";

class adminController {
  constructor() {
    this.HOTELS = [];
  }

  getHeaderData = async (req, res) => {
    try {
      const users = await models.Clients.count();
      const hotels = await models.Hotel.count();
      const regions = await models.Region.count();
      const rooms = await models.Room.count();
      const bookings = await models.Trip.count();

      res.status(200).json({ users, hotels, regions, rooms, bookings });
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const AdminController = new adminController();
