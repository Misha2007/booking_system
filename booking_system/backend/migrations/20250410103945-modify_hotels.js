"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Hotels", "regionId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Regions",
          key: "regionId",
        },
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.dropTable("Hotels")]);
  },
};
