"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("Clients", "firstName", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Clients", "lastName", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Clients", "email", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.changeColumn("Clients", "phoneNumber", {
        type: Sequelize.INTEGER,
        unique: true,
      }),
      queryInterface.changeColumn("Clients", "password", {
        type: Sequelize.CHAR,
        allowNull: false,
      }),
      queryInterface.changeColumn("Clients", "cardId", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([queryInterface.dropTable("Clients")]);
  },
};
