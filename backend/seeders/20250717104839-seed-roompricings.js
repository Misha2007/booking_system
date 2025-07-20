"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "RoomPricings",
      [
        {
          hotelId: 1,
          roomId: 1,
          priceDate: "2025-08-01",
          price: 85.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          hotelId: 1,
          roomId: 2,
          priceDate: "2025-08-01",
          price: 115.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          hotelId: 2,
          roomId: 3,
          priceDate: "2025-08-01",
          price: 180.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          hotelId: 2,
          roomId: 3,
          priceDate: "2025-08-02",
          price: 185.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("RoomPricings", null, {});
  },
};
