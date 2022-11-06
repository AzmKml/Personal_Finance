const request = require("supertest");
const app = require("../app");
const { sequelize, Category } = require("../models/index");
const { queryInterface } = sequelize;

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
        amount: 200000000,
        date: new Date(),
      },
      {
        WalletId: 1,
        CategoryId: 13,
        description: "pengeluaran",
        amount: 170000000,
        date: new Date(),
      },
      {
        WalletId: 1,
        CategoryId: 1,
        description: "pemasukan",
        amount: 70000000,
        date: new Date(),
      },
      {
        WalletId: 2,
        CategoryId: 1,
        description: "pemasukan",
        amount: 50000000,
        date: new Date(),
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
    await sequelize.query("delete from 'Wallets'");
    await sequelize.query("delete from sqlite_sequence where name='Wallets'");
    await sequelize.query("delete from 'Transactions'");
    await sequelize.query(
      "delete from sqlite_sequence where name='Transactions'"
    );
    await sequelize.query("delete from 'Categories'");
    await sequelize.query(
      "delete from sqlite_sequence where name='Categories'"
    );
    await sequelize.query(
      "UPDATE sqlite_sequence SET seq=1 WHERE name = 'Categories'"
    );
    await sequelize.query(
      "UPDATE sqlite_sequence SET seq=1 WHERE name = 'Wallets'"
    );
    await sequelize.query(
      "UPDATE sqlite_sequence SET seq=1 WHERE name = 'Transactions'"
    );
  } catch (error) {}
});

describe("GET /transactions", () => {
  describe("GET /transactions success", () => {
    it("Should be return an object", async () => {
      return request(app)
        .get("/transactions")
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toBeInstanceOf(Object);
        });
    }, 100000);
  });
});

describe("GET /transactions/transactionId ", () => {
  describe("Success", () => {
    it("Should be return an object", async () => {
      const response = await request(app).get("/transactions/1");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("amount", expect.any(Number));
      expect(response.body).toHaveProperty("date", expect.any(String));
      expect(response.body).toHaveProperty("CategoryId", expect.any(Number));
      expect(response.body).toHaveProperty("WalletId", expect.any(Number));
    }, 100000);
  });

  describe("Fail because transaction not found", () => {
    it("Should be return an object", async () => {
      return request(app)
        .get("/transactions/1000")

        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("message");
        });
    }, 100000);
  });

  describe("Failed request params transactionId is not number", () => {
    it("Should be return an object", async () => {
      return request(app)
        .get("/transactions/stringhere")
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("message");
        });
    }, 100000);
  });
});

describe("POST /transactions", () => {
  describe("success", () => {
    it("Should be return an object", async () => {
      const response = await request(app).post("/transactions").send({
        amount: 1000000,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1,
        description: "test",
      });

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed not provide description", () => {
    it("should be return an object message", async () => {
      const data = {
        amount: 2000,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1,
        description: "",
      };
      const response = await request(app).post("/transactions").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed not provide amount", () => {
    it("should be return an object message", async () => {
      const data = {
        amount: undefined,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1,
        description: "test",
      };
      const response = await request(app).post("/transactions").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed not provide date", () => {
    it("should be return an object message", async () => {
      const data = {
        amount: 2000,
        date: "",
        CategoryId: 1,
        WalletId: 1,
        description: "test",
      };
      const response = await request(app).post("/transactions").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed not provide categoryId", () => {
    it("should be return an object message", async () => {
      const data = {
        amount: 2000,
        date: new Date(),
        CategoryId: "",
        WalletId: 1,
        description: "test",
      };
      const response = await request(app).post("/transactions").send(data);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed not provide WalletId", () => {
    it("should be return an object message", async () => {
      const data = {
        amount: 2000,
        date: new Date(),
        CategoryId: 1,
        WalletId: "",
        description: "test",
      };
      const response = await request(app).post("/transactions").send(data);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed cant find walletId", () => {
    it("should be return an object message", async () => {
      const data = {
        amount: 2000,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1000,
        description: "test",
      };
      const response = await request(app).post("/transactions").send(data);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed cant find CategoryId", () => {
    it("should be return an object message", async () => {
      const data = {
        amount: 2000,
        date: new Date(),
        CategoryId: 1000,
        WalletId: 1,
        description: "test",
      };
      const response = await request(app).post("/transactions").send(data);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed amount making balance minus", () => {
    it("should be return an object message", async () => {
      const data = {
        amount: 1000000000,
        date: new Date(),
        CategoryId: 13,
        WalletId: 1,
        description: "test",
      };
      const response = await request(app).post("/transactions").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });
});

describe("PUT /transactions/:id", () => {
  describe("Succes test", () => {
    it("should be return an object message success", async () => {
      const data = {
        amount: 200000000,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1,
        description: "test",
      };
      const response = await request(app).put("/transactions/1").send(data);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed Transactions not found", () => {
    it("should be return an object message", async () => {
      const data = {
        description: "updateTest",
        amount: 2000,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1,
      };
      const response = await request(app).put("/transactions/100").send(data);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed Transactions id not valid", () => {
    it("should be return an object message", async () => {
      const data = {
        description: "updateTest",
        amount: 2000,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1,
      };
      const response = await request(app)
        .put("/transactions/string")
        .send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed Category id not found", () => {
    it("should be return an object message", async () => {
      const data = {
        description: "updateTest",
        amount: 200000000,
        date: new Date(),
        CategoryId: 1000,
        WalletId: 1,
      };
      const response = await request(app).put("/transactions/4").send(data);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("Failed wallet id not found", () => {
    it("should be return an object message", async () => {
      const data = {
        description: "updateTest",
        amount: 200000000,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1000,
      };
      const response = await request(app).put("/transactions/4").send(data);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("not provide input description", () => {
    it("should be return an object message", async () => {
      const data = {
        description: "",
        amount: 2000,
        date: new Date(),
        CategoryId: 1,
        UserId: 1,
        WalletId: 1,
      };
      const response = await request(app).put("/transactions/1").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });
  describe("not provide input amount", () => {
    it("should be return an object message", async () => {
      const data = {
        description: "updateTest",
        amount: null,
        date: new Date(),
        CategoryId: 1,
        WalletId: 1,
      };
      const response = await request(app).put("/transactions/1").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });
  describe("not provide input date", () => {
    it("should be return an object message", async () => {
      const data = {
        description: "updateTest",
        amount: 10000,
        date: "",
        CategoryId: 1,
        WalletId: 1,
      };
      const response = await request(app).put("/transactions/1").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("failed edited amount cannot make balance minus", () => {
    it("should be return an object message", async () => {
      const data = {
        description: "updateTest",
        amount: 100000000,
        date: new Date(),
        CategoryId: 13,
        WalletId: 1,
      };
      const response = await request(app).put("/transactions/1").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });
});

describe("Delete /transactions/:id", () => {
  describe("Succes test", () => {
    it("should return a success message", async () => {
      const response = await request(app).delete("/transactions/4");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });
  describe("Failed because Id is not number", () => {
    it("should return a message", async () => {
      const response = await request(app).delete("/transactions/string");
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });
  describe("failed Transactions not found", () => {
    it("should return error message", async () => {
      const response = await request(app).delete("/transactions/1000");
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("failed balance cannot minus", () => {
    it("should return error message", async () => {
      const response = await request(app).delete("/transactions/1");
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });
});
