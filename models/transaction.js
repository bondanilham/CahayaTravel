'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Armada, {foreignKey: 'ArmadaId'})
      Transaction.belongsTo(models.User, {foreignKey: 'UserId'})
    }
  }
  Transaction.init({
    ArmadaId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    jumlahKursi: DataTypes.INTEGER,
    totalHarga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};