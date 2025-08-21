"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Clients", "status", {
      type: Sequelize.ENUM("pending", "verified", "unverified"),
      defaultValue: "pending",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Clients", "status");
  },
};
