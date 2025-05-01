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
  },
  {
    sequelize,
    modelName: "Trip",
  }
);
export default Trip;
