"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Category, { foreignKey: "CategoryId" });
      Transaction.belongsTo(models.Wallet, { foreignKey: "WalletId" });
    }
  }
  Transaction.init(
    {
      WalletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Wallet id is required",
          },
          notNull: {
            msg: "Wallet id is required",
          },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Category id is required",
          },
          notNull: {
            msg: "Category id is required",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Transaction description is required",
          },
          notNull: {
            msg: "Transaction description is required",
          },
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Transaction amount is required",
          },
          notNull: {
            msg: "Transaction amount is required",
          },
          min: {
            args: [1],
            msg: "Minimum transaction amount is 1",
          },
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Transaction date is required",
          },
          notNull: {
            msg: "Transaction date is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
