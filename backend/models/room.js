"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class Room extends Model {
  static associate(models) {
    this.hasMany(models.RoomInfo, {
      foreignKey: "roomId",
      as: "roomInfos",
    });
  }
}

Room.init(
  {
    roomId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
