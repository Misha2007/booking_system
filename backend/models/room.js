"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class Room extends Model {
  static associate(models) {
    // Each Room belongs to a Hotel
    this.belongsTo(models.Hotel, {
      foreignKey: "hotelId",
      as: "hotel",
    });
    // Optionally: RoomType association if you have a RoomType model
    // this.belongsTo(models.RoomType, { foreignKey: "roomTypeId", as: "roomType" });
  }
}

Room.init(
  {
    Room: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Hotel",
        key: "hotelId",
      },
    },
    roomType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Add more fields as needed (e.g., price, capacity)
  },
  {
    sequelize,
    modelName: "Room",
    tableName: "Rooms",
    timestamps: false,
  }
);

export default Room;