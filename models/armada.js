'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Armada extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Armada.belongsTo(models.VehicleType, {foreignKey: 'VehicleTypeId'})
      Armada.hasMany(models.Transaction, {foreignKey: 'ArmadaId'})
    }

    get sisaKursi(){
      return this.totalSeats - this.filledSeats
    }
  }
  Armada.init({
    keberangkatan: DataTypes.STRING,
    destinasi: DataTypes.STRING,
    price: DataTypes.INTEGER,
    totalSeats: DataTypes.INTEGER,
    filledSeats: {
      type:DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Jumlah kursi terisi tidak boleh kosong'
        },
        moreThanTotal(value) {
          if (value > (this.totalSeats)) {
            throw new Error('Kursi tidak tersedia')
          }
        }
      }
    },
    VehicleTypeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Armada',
  });
  return Armada;
};