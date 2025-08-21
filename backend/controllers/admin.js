import "../util/db.js";
import models from "../models/index.js";
import sequelize from "../util/db.js";
import { Op, fn, col, literal, Sequelize } from "sequelize";

class adminController {
  constructor() {
    this.HOTELS = [];
  }

  getHeaderData = async (req, res) => {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);

      const users = await models.Clients.count();
      const hotels = await models.Hotel.count();
      const regions = await models.Region.count();
      const rooms = await models.Room.count();
      const bookings = await models.Trip.count();

      // Bookings Stats. New bookings (7 days)
      const bookingTrend = await models.Trip.findAll({
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("COUNT", col("tripId")), "count"],
        ],
        where: {
          createdAt: {
            [Op.gte]: lastWeek,
          },
        },
        group: [literal("DATE(createdAt)")],
        order: [[literal("DATE(createdAt)"), "ASC"]],
      });
      const dateList = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i));
        dateList.push(date.toISOString().split("T")[0]);
      }
      const filledBookingTrend = dateList.map((date) => {
        const existingData = bookingTrend.find((b) => b.get("date") === date);
        return {
          date,
          count: existingData ? parseInt(existingData.get("count")) : 0,
        };
      });

      // Regions Stats. Total hotels in every region
      const regionStats = await models.Region.findAll({
        attributes: [
          "regionName",
          [
            Sequelize.literal(
              `(SELECT COUNT(DISTINCT hotelId) FROM Hotels AS hotel WHERE hotel.regionId = Region.regionId)`
            ),
            "hotelCount",
          ],
        ],
        raw: true,
      });

      // Rooms Stats. Booked rooms && total rooms
      const roomStats = await models.RoomInfo.findAll({
        attributes: [
          "hotelId",
          "roomId",
          "room.roomType",
          [fn("SUM", col("RoomInfo.quantity")), "totalRooms"],
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM Trips AS trip 
          WHERE trip.roomId = room.roomId 
          AND trip.hotelId = hotel.hotelId)`
            ),
            "bookedRooms",
          ],
        ],
        include: [
          {
            model: models.Room,
            as: "room",
            required: true,
          },
          {
            model: models.Hotel,
            as: "hotel",
            required: true,
          },
        ],
        group: ["RoomInfo.hotelId", "RoomInfo.roomId", "room.roomType"],
        raw: true,
      });

      // Hotel Stats. Amount of bookings in every hotel
      const hotelStats = await models.Hotel.findAll({
        attributes: [
          "name",
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM Trips AS trip WHERE trip.hotelId = Hotel.hotelId)`
            ),
            "hotelBookings",
          ],
        ],
        raw: true,
      });

      // User Stats. New users (7 days)
      const userStats = await models.Clients.findAll({
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("COUNT", col("clientId")), "count"],
        ],
        where: {
          createdAt: {
            [Op.gte]: lastWeek,
          },
        },
        group: [literal("DATE(createdAt)")],
        order: [[literal("DATE(createdAt)"), "ASC"]],
      });

      // Verification Counts
      const verificationCounts = await models.Clients.findAll({
        attributes: ["status", [fn("COUNT", col("clientId")), "count"]],
        group: ["status"],
        raw: true,
      });

      const userTypeCounts = await models.Clients.findAll({
        attributes: ["role", [fn("COUNT", col("clientId")), "count"]],
        group: ["role"],
        raw: true,
      });

      // Revenue

      const revenueRaw = await models.Trip.findAll({
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("SUM", col("price")), "totalRevenue"],
        ],
        where: {
          createdAt: {
            [Op.gte]: lastWeek,
          },
        },
        group: [literal("DATE(createdAt)")],
        order: [[literal("DATE(createdAt)"), "ASC"]],
      });

      res.status(200).json([
        {
          key: "booking",
          data: bookings,
          dataStats: filledBookingTrend,
        },
        {
          key: "hotel",
          data: hotels,
          dataStats: hotelStats,
        },
        {
          key: "region",
          data: regions,
          dataStats: regionStats,
        },
        {
          key: "user",
          data: users,
          dataStats: dateList.map((date) => {
            const found = userStats.find((u) => u.get("date") === date);
            return {
              date,
              count: found ? parseInt(found.get("count")) : 0,
            };
          }),
        },
        {
          key: "room",
          data: rooms,
          dataStats: roomStats.map((room) => ({
            roomType: room.roomType,
            totalRooms: room.totalRooms,
            booked: room.bookedRooms,
          })),
        },
        {
          key: "verificationCounts",
          data: userTypeCounts.map((item) => ({
            role: item.role,
            count: parseInt(item.count),
          })),
          dataStats: verificationCounts.map((item) => ({
            status: item.status,
            count: parseInt(item.count),
          })),
        },

        {
          key: "revenue",
          data: null,
          dataStats: dateList.map((date) => {
            const day = revenueRaw.find((d) => d.get("date") === date);
            return {
              date,
              revenue: day ? parseFloat(day.get("totalRevenue")) : 0,
            };
          }),
        },
      ]);
    } catch (err) {
      console.error("Error fetching hotels data", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

export const AdminController = new adminController();
