const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const request = require("supertest");

// app
const app = require("../app");

// database
const db = require("../services/db.service");

// server
let server;

describe("Authentication auth API Tests", () => {
  // User for testing
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "testpassword",
  };

  // Mock server
  beforeAll(() => {
    server = app.listen(8080);
  });

  // Mock database query method
  jest.mock("../services/db.service", () => ({
    query: jest.fn(),
  }));

  // Mock bcrypt.hash method
  bcrypt.hash = jest.fn((data, salt, callback) =>
    callback(null, "hashedPassword")
  );

  // Mock bcrypt.compare method
  bcrypt.compare = jest.fn((password, hashedPassword, callback) =>
    callback(null, password === hashedPassword)
  );

  // Mock jwt.sign method
  jwt.sign = jest.fn(() => "mockedToken");

  it("should handle user signup", async () => {
    const response = await request(app).post("/api/auth/signup").send(testUser);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Signup successful");
  });

  it("should handle user login with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "hashedPassword",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("mockedToken");
  });

  it("should handle user login with invalid credentials", async () => {
    // Invalid password
    let response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "invalidPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");

    // Invalid email
    response = await request(app).post("/api/auth/login").send({
      email: "invalidEmail",
      password: testUser.password,
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");

    // Missing email
    response = await request(app).post("/api/auth/login").send({
      password: testUser.password,
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");

    // Missing password
    response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");

    // Missing email and password
    response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");

    // Missing email and invalid password
    response = await request(app).post("/api/auth/login").send({
      password: "invalidPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");

    // Missing password and invalid email
    response = await request(app).post("/api/auth/login").send({
      email: "invalidEmail",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");

    // Missing email and password
    response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  // delete user after tests
  afterAll(async () => {
    const query = `DELETE FROM users WHERE email = ?`;
    const values = [testUser.email];
    db.query(query, values);
  });

  // close server after tests
  afterAll(() => {
    server.close();
  });
});
