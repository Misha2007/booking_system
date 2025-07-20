"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "RoomInfos",
      [
        {
          hotelId: 1,
          roomId: 1,
          capacity: 1,
          basePrice: 80.0,
          quantity: 5,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          hotelId: 1,
          roomId: 2,
          capacity: 2,
          basePrice: 120.0,
          quantity: 10,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          hotelId: 2,
          roomId: 3,
          capacity: 4,
          basePrice: 250.0,
          quantity: 3,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("RoomInfos", null, {});
  },
};
