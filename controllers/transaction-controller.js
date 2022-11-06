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
      if (payload.balance < 0) throw { name: "Minus Balance" };
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
    const t = await sequelize.transaction();
    try {
      const { transactionId } = req.params;
      if (isNaN(+transactionId)) throw { name: "Invalid Id" };

      let { description, amount, CategoryId, WalletId, date } = req.body;
      if (isNaN(+amount)) throw { name: "Invalid input" };

      const findTransactions = await Transaction.findByPk(transactionId, {
        transaction: t,
      });
      if (!findTransactions) throw { name: "NotFound" };

      const findCategory = await Category.findByPk(
        findTransactions.CategoryId,
        { transaction: t }
      );

      if (
        WalletId != findTransactions.WalletId ||
        amount != findTransactions.amount ||
        CategoryId != findTransactions.CategoryId
      ) {
        let balance = 0;

        if (findCategory.type === "Income") {
          balance = -findTransactions.amount;
        } else if (findCategory.type === "Expense") {
          balance = +findTransactions.amount;
        }
        const clearBalance = await Wallet.increment(
          { balance },
          { where: { id: findTransactions.WalletId }, transaction: t }
        );

        const checkBalance = await Wallet.findByPk(findTransactions.WalletId, {
          transaction: t,
        });
        if (checkBalance.balance < 0) throw { name: "Minus Balance" };

        const newWallet = await Wallet.findByPk(WalletId, {
          transaction: t,
        });
        if (!newWallet) throw { name: "NotFound" };

        const newCategory = await Category.findByPk(CategoryId, {
          transaction: t,
        });
        if (!newCategory) throw { name: "NotFound" };

        let newBalance = 0;
        if (newCategory.type === "Income") {
          newBalance = +amount;
        } else if (newCategory.type === "Expense") {
          newBalance = -amount;
        }

        let updatedWallet = await Wallet.increment(
          { balance: newBalance },
          { where: { id: WalletId }, transaction: t }
        );

        let checkBalance2 = await Wallet.findByPk(WalletId, {
          transaction: t,
        });
        if (checkBalance2.balance < 0) throw { name: "Minus Balance" };
      }

      const transactionUpdated = await Transaction.update(
        {
          description,
          amount,
          date,
          CategoryId,
          WalletId,
        },
        {
          where: {
            id: transactionId,
          },
          transaction: t,
        }
      );

      await t.commit();

      res.status(200).json({
        message: "Succes Edit Transaction with Id " + transactionId,
      });
    } catch (error) {
      await t.rollback();
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

      const findCategory = await Category.findByPk(findTransaction.CategoryId, {
        transaction: t,
      });

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

      const checkBalance = await Wallet.findByPk(findTransaction.WalletId, {
        transaction: t,
      });
      if (checkBalance.balance < 0) throw { name: "Minus Balance" };

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
