"use strict";

import {Model, DataTypes} from 'sequelize'; 
import sequelize from "../util/db.js";

class Clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Clients.init(
    {
      clientId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      }, 
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      password: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      cardId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Clients",
    }
  );



export default Clients