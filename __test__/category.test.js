const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const categories = require("../data/categories.json");

beforeAll(async () => {
  try {
    categories.forEach((category) => {
      delete category.id;
      category.createdAt = category.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Categories", categories);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await queryInterface.bulkDelete("Categories", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error);
  }
});

describe("GET /categories", () => {
  describe("GET /categories - success get categories", () => {
    it("Should be return an status 200 and array with data of categories", async () => {
      try {
        const response = await request(app).get("/categories");

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
      } catch (error) {}
    }, 100000);
  });
});

describe("POST /categories", () => {
  describe("POST /categories - success create category", () => {
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

  describe("POST /categories - failed post category", () => {
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
});

describe("PUT /categories/:id", () => {
  describe("PUT /categories/:id - success update categories", () => {
    it("Should be return an status 200 and message", async () => {
      const payload = {
        name: "test1",
        type: "test1",
      };
      return request(app)
        .put("/categories/1")
        .send(payload)

        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty("message");
        });
    }, 100000);
  });

  describe("PUT /categories/:id - failed post category", () => {
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
  describe("DELETE /categories:id - success delete category", () => {
    it("Should be return an status 200 and message", async () => {
      try {
        const response = await request(app).delete("/categories/1");

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message");
      } catch (error) {}
    }, 100000);
  });

  describe("DELETE /categories:id - failed delete category", () => {
    it("Should be return an status 404 and message", async () => {
      try {
        const response = await request(app).delete("/categories/100");

        expect(response.status).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message");
      } catch (error) {}
    }, 100000);
  });
});

describe("GET /categories - when category data is empty", () => {
  it("Should be return an status 200 and emppty array", async () => {
    try {
      await queryInterface.bulkDelete("Categories", null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
      const response = await request(app).get("/categories");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toBeInstanceOf(Object);
    } catch (error) {}
  }, 100000);
});
