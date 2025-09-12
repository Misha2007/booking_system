"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class Trip extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.belongsTo(models.Hotel, {
      foreignKey: "hotelId",
      as: "hotels",
    });
    this.belongsTo(models.Clients, {
      foreignKey: "clientId",
      as: "clients",
    });
  }
}
Trip.init(
  {
    tripId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    departureDate: { type: DataTypes.DATE, allowNull: false },
    arrivalDate: { type: DataTypes.DATE, allowNull: false },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Hotel",
        key: "hotelId",
      },
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Clients",
        key: "clientId",
      },
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Rooms",
        key: "Room",
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Trip",
  }
);
export default Trip;
