'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Transactions', 'jumlahKursi', {type: Sequelize.DataTypes.INTEGER})
    await queryInterface.addColumn('Transactions', 'totalHarga', {type: Sequelize.DataTypes.INTEGER})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Transactions', 'jumlahKursi')
    await queryInterface.removeColumn('Transactions', 'totalHarga')
  }
};
