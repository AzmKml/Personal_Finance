"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      WalletId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Wallets",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      description: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
