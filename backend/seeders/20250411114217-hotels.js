"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert(
        "Hotels",
        [
          {
            hotelId: 1,
            name: "Hotel Soho",
            location: null,
            availableRooms: null,
            hotelRating: 4.6,
            price: 50,
            image:
              "https://cf.bstatic.com/xdata/images/hotel/square600/371896039.webp?k=6386b5949904e76fedbf862547d98b6be1143175f423f1a711ec9a62bb1d6e43&o=",
            regionId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            hotelId: 2,
            name: "Draakon Hotel",
            location: null,
            availableRooms: null,
            hotelRating: 3.5,
            price: 50,
            image:
              "https://cf.bstatic.com/xdata/images/hotel/max1024x768/2753125.jpg?k=f8215e38aa420367f9196cd5619fcfa5157a1fda084466bcb803eda031c6e93a&o=&hp=1",
            regionId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            hotelId: 3,
            name: "Springfield at Sea Resort & Spa",
            location: null,
            availableRooms: null,
            hotelRating: 5.0,
            price: 50,
            image:
              "https://cf.bstatic.com/xdata/images/hotel/max1280x900/266923700.jpg?k=3306fa6ad63862f227d83f51a825e2d6255cd15de37217a470ae94813d5e3d2a&o=&hp=1",
            regionId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            hotelId: 4,
            name: "Carolina Hotel",
            location: null,
            availableRooms: null,
            hotelRating: 3.2,
            price: 40,
            image:
              "https://www.carolina.ee/photos/Fassaad%20%202009.jpg?1389297182377",
            regionId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    } catch (error) {
      console.error("Error occurred during seeding:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Hotels", null, {});
  },
};
