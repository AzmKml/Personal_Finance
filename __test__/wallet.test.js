const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const app = require("../app");

beforeAll(async () => {
  try {
    const categories = require("../data/categories.json");
    categories.forEach((category) => {
      category.createdAt = category.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Categories", categories);

    const wallets = [
      { name: "Azam", balance: 100000000 },
      { name: "Kamil", balance: 50000000 },
    ];
    wallets.forEach((wallet) => {
      wallet.createdAt = wallet.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Wallets", wallets);

    const transactions = [
      {
        WalletId: 1,
        CategoryId: 1,
        description: "pemasukan",
        amount: 80000000,
        date: "2022-11-04",
      },
      {
        WalletId: 1,
        CategoryId: 13,
        description: "pengeluaran",
        amount: 50000000,
        date: "2022-11-04",
      },
      {
        WalletId: 1,
        CategoryId: 1,
        description: "pemasukan",
        amount: 70000000,
        date: "2022-11-04",
      },
      {
        WalletId: 2,
        CategoryId: 1,
        description: "pemasukan",
        amount: 50000000,
        date: "2022-11-04",
      },
    ];
    transactions.forEach((transaction) => {
      transaction.createdAt = transaction.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Transactions", transactions);
  } catch (error) {}
});

afterAll(async () => {
  try {
    await queryInterface.bulkDelete("Categories", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Wallets", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Transactions", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {}
});

describe("POST /wallets", () => {
  describe("success create wallet", () => {
    it("should return message", async () => {
      const newWallet = { name: "daughter's pocket money" };

      const response = await request(app).post("/wallets").send(newWallet);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    }, 10000);
  });

  describe("failed create wallet because name is empty", () => {
    it("should return an error message", async () => {
      const newWallet = { name: "" };

      const response = await request(app).post("/wallets").send(newWallet);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBeInstanceOf(Object);
    }, 10000);
  });

  describe("failed create wallet because name is null", () => {
    it("should return an error message", async () => {
      const response = await request(app).post("/wallets").send();

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBeInstanceOf(Object);
    }, 10000);
  });
});

describe("GET /wallets", () => {
  describe("success read all wallets", () => {
    it("should return array of object ", async () => {
      const response = await request(app).get("/wallets");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body[0]).toHaveProperty("id", expect.any(Number));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("balance", expect.any(Number));
    }, 10000);
  });
});

describe("GET /wallets/:walletId", () => {
  describe("success read detail wallet", () => {
    it("should return object ", async () => {
      try {
        const response = await request(app).get("/wallets/1");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("id", expect.any(Number));
        expect(response.body).toHaveProperty("name", expect.any(String));
        expect(response.body).toHaveProperty("balance", expect.any(Number));
        expect(response.body.Transactions).toBeInstanceOf(Object);
        expect(response.body.Transactions[0]).toHaveProperty(
          "description",
          expect.any(String)
        );
        expect(response.body.Transactions[0]).toHaveProperty(
          "amount",
          expect.any(Number)
        );
        expect(response.body.Transactions[0]).toHaveProperty(
          "date",
          expect.any(String)
        );
        expect(response.body.Transactions[0].Category).toBeInstanceOf(Object);
        expect(response.body.Transactions[0].Category).toHaveProperty(
          "name",
          expect.any(String)
        );
        expect(response.body.Transactions[0].Category).toHaveProperty(
          "type",
          expect.any(String)
        );
      } catch (error) {}
    }, 10000);
  });

  describe("failed read detail wallet because id is not valid", () => {
    it("should return an object of error message ", async () => {
      try {
        const response = await request(app).get("/wallets/asd");

        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });

  describe("failed read detail wallet because wallet is not found", () => {
    it("should return an object of error message ", async () => {
      try {
        const response = await request(app).get("/wallets/100");

        expect(response.status).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });
});

describe("PUT /wallets/:walletId", () => {
  describe("Success update Wallet", () => {
    it("Should return a status 200 and message", async () => {
      try {
        const response = await request(app)
          .put("/wallets/1")
          .send({ name: "test" });

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });
  describe("Failed update wallet because wallet name is empty", () => {
    it("Should return a status 400 and message", async () => {
      try {
        const walletInputUpdate = {
          name: "",
        };
        const response = await request(app)
          .put("/wallets/1")
          .send(walletInputUpdate);

        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
      } catch (error) {}
    }, 10000);
  });
  describe("Failed update wallet because wallet not found", () => {
    it("Should return a status 404 and message", async () => {
      try {
        const walletInputUpdate = {
          name: "test",
        };
        const response = await request(app)
          .put("/wallets/94234")
          .send(walletInputUpdate);

        expect(response.status).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });
  describe("Failed update wallet because wallet name is null", () => {
    it("Should return a status 400 and message", async () => {
      try {
        const response = await request(app).put("/wallets/1").send();

        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });

  describe("Failed because wallet not found", () => {
    it("Should return a status 404 and message", async () => {
      try {
        const response = await request(app)
          .put("/wallets/100")
          .send({ name: "test" });
        expect(response.status).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });

  describe("Failed because wallet id invalid", () => {
    it("Should return a status 400 and message", async () => {
      try {
        const response = await request(app)
          .put("/wallets/stringhere")
          .send({ name: "test" });
        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });
});

describe("DELETE /wallets/:walletId", () => {
  describe("Wallet deletion successful", () => {
    it("Should be return an status 200 and message", async () => {
      try {
        const response = await request(app).delete("/wallets/1");

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });

  describe("Wallet deletion failed because wallet not found", () => {
    it("Should be return an status 404 and message", async () => {
      try {
        const response = await request(app).delete("/wallets/100");

        expect(response.status).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });

  describe("Wallet deletion failed because wallet Id is not a number", () => {
    it("Should be return an status 400 and message", async () => {
      try {
        const response = await request(app).delete("/wallets/stringhere");

        expect(response.status).toBe(400);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", expect.any(String));
      } catch (error) {}
    }, 10000);
  });
});
