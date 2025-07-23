"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Images", {
      imageId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hotelId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Hotels",
          key: "hotelId",
        },
        onDelete: "CASCADE",
      },
      roomInfoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "RoomInfos",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      isCover: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      altText: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Images");
  },
};
