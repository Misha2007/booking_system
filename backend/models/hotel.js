"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class Hotel extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    /*
    this.belongsTo(models.Region, {
      foreignKey: {
        name: "regionId",
        field: "regionId",
        as: "regions",
      },
    });*/
    this.belongsTo(models.Region, {
      foreignKey: "regionId",
      as: "region",
    });
    this.hasMany(models.Room, {
      foreignKey: "hotelId",
      as: "rooms",
    });
  }
}

Hotel.init(
  {
    hotelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    availableRooms: {
      type: DataTypes.INTEGER,
    },
    hotelRating: {
      type: DataTypes.FLOAT,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Region",
        key: "regionId",
      },
    },
  },
  {
    sequelize,
    modelName: "Hotel",
  }
);

export default Hotel;
