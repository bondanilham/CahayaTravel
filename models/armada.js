'use strict';
const {
  Model,
  Op
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
      Armada.belongsToMany(models.User, {
        through: models.Transaction,
        foreignKey: 'ArmadaId',
        otherKey: 'UserId'
      })
    }

    get sisaKursi(){
      return this.totalSeats - this.filledSeats
    }

    static async search({ keberangkatan, destinasi, penumpang }) {
      const { VehicleType } = this.sequelize.models
      const property = {
        include: [{ model: VehicleType }],
        where: {}
      }

      penumpang = +penumpang

      if (keberangkatan) {
        property.where.keberangkatan = { [Op.iLike]: `%${keberangkatan}%` }
      }
      if (destinasi) {
        property.where.destinasi = { [Op.iLike]: `%${destinasi}%` }
      }
      if (penumpang) {
        property.where[Op.and] = this.sequelize.literal(
          `"totalSeats" - "filledSeats" >= ${penumpang}`
        )
      }

      return await this.findAll(property)
    }
  }
  Armada.init({
    keberangkatan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Keberangkatan harus diisi'
        },
        notNull: {
          msg: 'Keberangkatan harus diisi'
        }
      }
    },
    destinasi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Destinasi harus diisi'
        },
        notNull: {
          msg: 'Destinasi harus diisi'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Harga harus diisi'
        },
        min: {
          args: [1],
          msg: 'Harga harus lebih dari 0'
        }
      }
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Total kursi harus diisi'
        },
        min: {
          args: [1],
          msg: 'Total kursi minimal 1'
        }
      }
    },
    filledSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    VehicleTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Tipe kendaraan harus dipilih'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate(armada) {
        armada.filledSeats = 0
      }
    },
    sequelize,
    modelName: 'Armada',
  });
  return Armada;
};