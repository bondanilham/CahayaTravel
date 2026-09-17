'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {foreignKey: 'UserId'})
    }
    
    get displayName(){
      return this.nama
    }

  }
  Profile.init({
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name must be filled"
        },
        notNull: {
          msg: "Name must be filled"
        }
      }
    },
    foto: {
      type: DataTypes.STRING
    },
    ktp: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "KTP must be filled"
        },
        notNull: {
          msg: "KTP must be filled"
        }
      }
    },
    phoneNumber: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "User ID must be filled"
        },
        notNull: {
          msg: "User ID must be filled"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};