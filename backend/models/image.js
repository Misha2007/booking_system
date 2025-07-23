"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class Image extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.belongsTo(models.Hotel, { foreignKey: "hotelId" });
    this.belongsTo(models.RoomInfo, {
      foreignKey: "roomInfoId",
      onDelete: "CASCADE",
    });
  }
}
Image.init(
  {
    imageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    roomInfoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isCover: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    altText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Image",
  }
);

export default Image;
