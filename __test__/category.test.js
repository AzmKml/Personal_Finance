const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const categories = require("../data/categories.json");

beforeAll(async () => {
  try {
    categories.forEach((category) => {
      category.createdAt = category.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Categories", categories);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await sequelize.query("delete from 'Categories'");
    await sequelize.query(
      "delete from sqlite_sequence where name='Categories'"
    );
    await sequelize.query(
      "UPDATE sqlite_sequence SET seq=1 WHERE name = 'Categories'"
    );
  } catch (error) {
    console.log(error);
  }
});

describe("GET /categories", () => {
  describe("success get categories", () => {
    it("Should be return an status 200 and array with data of categories", async () => {
      const response = await request(app).get("/categories");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toBeInstanceOf(Object);
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("type", expect.any(String));
    }, 100000);
  });
});

describe("POST /categories", () => {
  describe("success create category", () => {
    it("Should be return an status 201 and message", async () => {
      const payload = {
        name: "test",
        type: "test",
      };
      return request(app)
        .post("/categories")
        .send(payload)
        .then((response) => {
          expect(response.status).toBe(201);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("message");
        });
    }, 100000);
  });

  describe("failed post category name not provide", () => {
    it("Should be return an status 400 and object with message error", async () => {
      const payload = {
        name: "",
        type: "test",
      };
      return request(app)
        .post("/categories")
        .send(payload)

        .then((response) => {
          expect(response.status).toBe(400);
          expect(response.body).toBeInstanceOf(Object);
        });
    }, 100000);
  });
  describe("failed post category type not provide", () => {
    it("Should be return an status 400 and object with message error", async () => {
      const payload = {
        name: "test",
        type: "",
      };
      return request(app)
        .post("/categories")
        .send(payload)

        .then((response) => {
          expect(response.status).toBe(400);
          expect(response.body).toBeInstanceOf(Object);
        });
    }, 100000);
  });
  describe("failed post category no type", () => {
    it("Should be return an status 400 and object with message error", async () => {
      const payload = {
        name: "test",
      };
      return request(app)
        .post("/categories")
        .send(payload)

        .then((response) => {
          expect(response.status).toBe(400);
          expect(response.body).toBeInstanceOf(Object);
        });
    }, 100000);
  });
  describe("failed post category no name", () => {
    it("Should be return an status 400 and object with message error", async () => {
      const payload = {
        type: "test",
      };
      return request(app)
        .post("/categories")
        .send(payload)

        .then((response) => {
          expect(response.status).toBe(400);
          expect(response.body).toBeInstanceOf(Object);
        });
    }, 100000);
  });
});

describe("PUT /categories/:id", () => {
  describe("success update categories", () => {
    it("Should be return an status 200 and message", async () => {
      const payload = {
        name: "test1",
        type: "test1",
      };
      const response = await request(app).put("/categories/1").send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("failed post category", () => {
    it("Should be return an status 400 and object with message error", async () => {
      const payload = {
        name: "",
        type: "test",
      };
      return request(app)
        .put("/categories/1")
        .send(payload)

        .then((response) => {
          expect(response.status).toBe(400);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("message");
        });
    }, 100000);
    it("Should be return an status 400 and object with message error", async () => {
      const payload = {
        name: "test",
        type: "",
      };
      return request(app)
        .put("/categories/1")
        .send(payload)

        .then((response) => {
          expect(response.status).toBe(400);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("message");
        });
    }, 100000);

    it("Should be return an status 404 and object with message error", async () => {
      const payload = {
        name: "test",
        type: "test",
      };
      return request(app)
        .put("/categories/30")
        .send(payload)

        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("message");
        });
    }, 100000);
  });
});

describe("DELETE /categories:id", () => {
  describe("success delete category", () => {
    it("Should be return an status 200 and message", async () => {
      const response = await request(app).delete("/categories/1");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("failed delete category", () => {
    it("Should be return an status 404 and error message", async () => {
      const response = await request(app).delete("/categories/100");

      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });

  describe("failed delete category invalid id", () => {
    it("Should be return an status 400 and error message", async () => {
      const response = await request(app).delete("/categories/stringhere");

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    }, 100000);
  });
});
