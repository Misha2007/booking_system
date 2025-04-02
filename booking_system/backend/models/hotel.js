'use strict';
import {Model, DataTypes} from 'sequelize'; 
import sequelize from "../util/db.js";


  class Hotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Hotel.init({
    hotelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    } 
    },
    {
    sequelize,
    modelName: 'Hotel',
    });

    export default Hotel