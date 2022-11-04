const { Wallet, Transaction, Category } = require("../models");
const { Op } = require("sequelize");

class Controller {
  static async getAllWallet(req, res, next) {
    try {
      const wallets = await Wallet.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["name"]],
      });

      res.status(200).json(wallets);
    } catch (error) {
      next(error);
    }
  }

  static async getDetailWallet(req, res, next) {
    try {
      const { walletId } = req.params;
      if (isNaN(+walletId)) throw { name: "Invalid Id" };

      const param = {
        include: [
          {
            model: Transaction,
            include: {
              model: Category,
            },
          },
        ],
        attributes: {
          exclude: ["updatedAt"],
        },
      };

      const wallet = await Wallet.findByPk(walletId, param);

      if (!wallet) {
        throw { name: "NotFound" };
      }

      res.status(200).json(wallet);
    } catch (error) {
      next(error);
    }
  }

  static async addNewWallet(req, res, next) {
    try {
      const { name } = req.body;
      const newWallet = await Wallet.create({
        name,
      });

      res.status(201).json({
        message: `${name} wallet created with balance ${newWallet.balance}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteWallet(req, res, next) {
    try {
      const { walletId } = req.params;
      if (isNaN(+walletId)) throw { name: "Invalid Id" };

      let deletedWallet = await Wallet.destroy({
        where: {
          id: walletId,
        },
      });
      if (!deletedWallet) throw { name: "NotFound" };

      res
        .status(200)
        .json({ message: `Wallet with id ${walletId} successfully deleted` });
    } catch (error) {
      next(error);
    }
  }

  static async updateWallet(req, res, next) {
    try {
      const { walletId } = req.params;
      const { name } = req.body;
      if (isNaN(+walletId)) throw { name: "Invalid Id" };
      if (!name) {
        throw { name: "Invalid input" };
      }

      const checkWallet = await Wallet.findByPk(walletId);
      if (!checkWallet) throw { name: "NotFound" };

      const updatedWallet = await Wallet.update(
        { name },
        {
          where: {
            id: walletId,
          },
        }
      );
      if (!updatedWallet[0]) throw { name: "Invalid input" };

      res
        .status(200)
        .json({ message: `Wallet with id ${walletId} successfully updated` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
