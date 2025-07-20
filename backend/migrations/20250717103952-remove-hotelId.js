"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Rooms", "hotelId");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Rooms", "hotelId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Hotels",
        key: "hotelId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
