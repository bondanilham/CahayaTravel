'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {foreignKey: 'UserId'})
      User.hasMany(models.Transaction, {foreignKey: 'UserId'})
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Email must be filled"
        },
        notNull: {
          msg: "Email must be filled"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Email must be filled"
        },
        notNull: {
          msg: "Email must be filled"
        }
      }
    },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(instance, options){
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(instance.password, salt)
        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};