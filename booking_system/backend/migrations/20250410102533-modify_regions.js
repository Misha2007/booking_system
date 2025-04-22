"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("Regions", "regionName", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("Regions", "countryName", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.dropTable("Regions")]);
  },
};
