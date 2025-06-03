"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Clients", "role", {
      type: Sequelize.ENUM("client", "admin"),
      allowNull: false,
      defaultValue: "client",
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Clients", "role");
  },
};
