const { Op } = require("sequelize");
const { Transaction, sequelize, Category, User, Wallet } = require("../models");

class TransactionController {
  static async addTransaction(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { description, amount, date, CategoryId, WalletId } = req.body;

      const findCategory = await Category.findByPk(CategoryId, {
        transaction: t,
      });
      if (!findCategory) throw { name: "NotFound" };

      const findWallet = await Wallet.findByPk(WalletId, { transaction: t });
      if (!findWallet) throw { name: "NotFound" };

      const createTransaction = await Transaction.create(
        {
          description,
          amount,
          date,
          CategoryId,
          WalletId,
        },
        {
          returning: true,
          transaction: t,
        }
      );

      let payload = {};
      if (findCategory.type === "Income") {
        payload = { balance: findWallet.balance + +amount };
      } else if (findCategory.type === "Expense") {
        payload = { balance: findWallet.balance - +amount };
      }
      let updatedWallet = await Wallet.update(payload, {
        where: {
          id: findWallet.id,
        },
        transaction: t,
      });
      if (!updatedWallet[0]) throw { name: "Invalid input" };

      await t.commit();
      res.status(201).json({
        message: `Success create new Transaction. Now your balance is ${payload.balance}`,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async getTransaction(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  static async updateTransaction(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  static async deleteTransaction(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  static async getDetailTransaction(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
