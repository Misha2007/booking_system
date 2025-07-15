"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Rooms", [
      {
        Room: 1,
        hotelId: 1,
        roomType: "Deluxe",
        roomName: "Deluxe Room A",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Room: 2,
        hotelId: 1,
        roomType: "Standard",
        roomName: "Standard Room B",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Room: 3,
        hotelId: 2,
        roomType: "Suite",
        roomName: "Luxury Suite C",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Rooms", null, {});
  },
};
