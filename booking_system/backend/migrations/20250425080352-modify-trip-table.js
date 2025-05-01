"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("Trips", "hotelId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Hotels",
          key: "hotelId",
        },
      }),
      queryInterface.changeColumn("Trips", "departureDate", {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.changeColumn("Trips", "arrivalDate", {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.changeColumn("Trips", "bookingDate", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.dropTable("Trips")]);
  },
};
