'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Armadas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keberangkatan: {
        type: Sequelize.STRING
      },
      destinasi: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      totalSeats: {
        type: Sequelize.INTEGER
      },
      filledSeats: {
        type: Sequelize.INTEGER
      },
      VehicleTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'VehicleTypes',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Armadas');
  }
};