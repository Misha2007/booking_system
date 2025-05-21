"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Regions",
      [
        {
          regionId: 1,
          countryName: "Estonia",
          regionName: "Europe",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          regionId: 2,
          countryName: "Thailand",
          regionName: "Asia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          regionId: 3,
          countryName: "USA",
          regionName: "North America",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          regionId: 4,
          countryName: "Japan",
          regionName: "Asia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Regions", null, {});
  },
};
