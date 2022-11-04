const { Op } = require("sequelize");
const { Transaction, sequelize, Category, Wallet } = require("../models");

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
      const findTransactions = await Transaction.findAll({
        include: [
          {
            model: Category,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        order: [["id", "DESC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json(findTransactions);
    } catch (error) {
      next(error);
    }
  }

  static async getDetailTransaction(req, res, next) {
    try {
      const { transactionId } = req.params;
      if (isNaN(+transactionId)) throw { name: "Invalid Id" };

      const transaction = await Transaction.findByPk(transactionId, {
        include: [
          {
            model: Category,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Wallet,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!transaction) throw { name: "NotFound" };

      res.status(200).json(transaction);
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
    const t = await sequelize.transaction();
    try {
      const { transactionId } = req.params;
      if (isNaN(+transactionId)) throw { name: "Invalid Id" };

      const findTransaction = await Transaction.findByPk(transactionId, {
        transaction: t,
      });
      if (!findTransaction) throw { name: "NotFound" };

      const findWallet = await Wallet.findByPk(findTransaction.WalletId, {
        transaction: t,
      });
      if (!findWallet) throw { name: "NotFound" };

      const findCategory = await Category.findByPk(findTransaction.CategoryId, {
        transaction: t,
      });
      if (!findCategory) throw { name: "NotFound" };

      let payload = { balance: findWallet.balance };
      if (findCategory.type === "Income") {
        payload.balance -= +findTransaction.amount;
      } else if (findCategory.type === "Expense") {
        payload.balance += +findTransaction.amount;
      }
      const updatedWallet = await Wallet.update(payload, {
        where: {
          id: findWallet.id,
        },
        transaction: t,
      });
      if (!updatedWallet[0]) throw { name: "Invalid input" };

      await Transaction.destroy({
        where: {
          id: transactionId,
        },
        transaction: t,
      });

      await t.commit();
      res.status(200).json({
        message: "Success delete Transaction with Id " + transactionId,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = TransactionController;
