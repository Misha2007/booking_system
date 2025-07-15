"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Trips", "roomId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Rooms",
        key: "Room",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Trips", "roomId");
  },
};
