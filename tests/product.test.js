const jwt = require("jsonwebtoken");
const request = require("supertest");

// app
const app = require("../app");

// server
let server;

// Mock jwt.verify method
jwt.verify = jest.fn((token, secret, callback) => callback(null, {}));

describe("Authentication products API Tests", () => {
  // Product for testing
  const testProduct = {
    name: "Test Product",
    price: 100,
    description: "Test description",
  };

  // Mock server
  beforeAll(() => {
    server = app.listen(8080);
  });

  // Mock database query method
  jest.mock("../services/db.service", () => ({
    query: jest.fn(),
  }));

  it("should handle product creation", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer token`)
      .send(testProduct);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product added");
  });

  it("should handle product listing", async () => {
    const response = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer token`);

    expect(response.status).toBe(200);
    expect(response.body.products).toBeDefined();
  });

  it("should handle product retrieval", async () => {
    const response = await request(app)
      .get("/api/products/1")
      .set("Authorization", `Bearer token`);

    expect(response.status).toBe(200);
    expect(response.body.product).toBeDefined();
  });

  it("should handle product update", async () => {
    const response = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer token`)
      .send(testProduct);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product updated");
  });

  it("should handle product deletion", async () => {
    const response = await request(app)
      .delete("/api/products/1")
      .set("Authorization", `Bearer token`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted");
  });

  // Close server
  afterAll((done) => {
    server.close(done);
  });
});
