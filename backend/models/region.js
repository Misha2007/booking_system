"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class Region extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.hasMany(models.Hotel, {
      foreignKey: "regionId",
      as: "hotels",
    });
  }
}
Region.init(
  {
    regionId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    regionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Region",
  }
);

export default Region;
