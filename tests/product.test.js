const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const request = require("supertest");

// app
const app = require("../app");

// database
const db = require("../services/db.service");

// server
let server;

describe("Authentication products API Tests", () => {
  // User for testing
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "testpassword",
  };

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

  // Mock jwt.verify method
  jwt.verify = jest.fn(() => testUser);

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

  it("should handle product retrieval with invalid id", async () => {
    const response = await request(app)
      .get("/api/products/1")
      .set("Authorization", `Bearer token`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  it("should handle product update with invalid id", async () => {
    const response = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer token`)
      .send(testProduct);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  it("should handle product deletion with invalid id", async () => {
    const response = await request(app)
      .delete("/api/products/1")
      .set("Authorization", `Bearer token`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  it("should handle product creation with missing name", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer token`)
      .send({
        price: testProduct.price,
        description: testProduct.description,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing name");
  });

  it("should handle product creation with missing price", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer token`)
      .send({
        name: testProduct.name,
        description: testProduct.description,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing price");
  });

  it("should handle product creation with missing description", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer token`)
      .send({
        name: testProduct.name,
        price: testProduct.price,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing description");
  });

  it("should handle product creation with invalid price", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer token`)
      .send({
        name: testProduct.name,
        price: "invalidPrice",
        description: testProduct.description,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid price");
  });

  it("should handle product update with missing name", async () => {
    const response = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer token`)
      .send({
        price: testProduct.price,
        description: testProduct.description,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing name");
  });

  it("should handle product update with missing price", async () => {
    const response = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer token`)
      .send({
        name: testProduct.name,
        description: testProduct.description,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing price");
  });

  it("should handle product update with missing description", async () => {
    const response = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer token`)
      .send({
        name: testProduct.name,
        price: testProduct.price,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing description");
  });

  it("should handle product update with invalid price", async () => {
    const response = await request(app)
      .put("/api/products/1")
      .set("Authorization", `Bearer token`)
      .send({
        name: testProduct.name,
        price: "invalidPrice",
        description: testProduct.description,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid price");
  });

  // Close server
  afterAll(() => {
    server.close();
  });
});
