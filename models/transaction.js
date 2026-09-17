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

    get paymentStatus(){
      if (this.statusBayar) {
        return 'Paid'
      } else return 'Belum Dibayar'
    }
  }
  Transaction.init({
    ArmadaId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    jumlahKursi: DataTypes.INTEGER,
    totalHarga: DataTypes.INTEGER,
    statusBayar: DataTypes.BOOLEAN
  }, {
    hooks:{
      beforeCreate(transaksi){
        transaksi.statusBayar = false
      }
    },
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};