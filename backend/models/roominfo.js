"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class RoomInfo extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.belongsTo(models.Hotel, {
      foreignKey: "hotelId",
      onDelete: "CASCADE",
      as: "hotel",
    });
    this.belongsTo(models.Room, {
      foreignKey: "roomId",
      onDelete: "CASCADE",
      as: "room",
    });
  }
}
RoomInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Hotels",
        key: "hotelId",
      },
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Rooms",
        key: "roomId",
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RoomInfo",
  }
);

export default RoomInfo;
