'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   let allData = JSON.parse(await fs.readFile('./data_dummy/vehicleType-demo.json', 'utf8'))
    
    allData.forEach(data => {
      data.createdAt = new Date()
      data.updatedAt = new Date()
    });

    await queryInterface.bulkInsert('VehicleTypes', allData, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('VehicleTypes', null, {})
  }
};
