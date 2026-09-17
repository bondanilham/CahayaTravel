'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VehicleType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VehicleType.hasMany(models.Armada, {foreignKey: 'VehicleTypeId'})
    }
  }
  VehicleType.init({
    typeBrand: DataTypes.STRING,
    typeSeries: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VehicleType',
  });
  return VehicleType;
};