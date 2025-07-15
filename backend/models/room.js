"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class Room extends Model {
  static associate(models) {
    this.belongsTo(models.Hotel, {
      foreignKey: "hotelId",
      as: "hotel",
    });
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
  },
  {
    sequelize,
    modelName: "Room",
    tableName: "Rooms",
    timestamps: false,
  }
);

export default Room;
