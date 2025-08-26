"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Hotels", "image");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Hotels", "image", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
