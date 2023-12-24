const bcrypt = require("bcryptjs");
const express = require("express");

// database
const db = require("../services/db.service");

// initialize router
const router = express.Router();

// signup
router.post("/signup", (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    // hash password
    bcrypt.hash(data.password, 10, async (err, hash) => {
      if (err) throw err;

      // save user to database
      const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
      const values = [data.name, data.email, hash];
      db.query(query, values);

      // return response
      res.status(200).json({ message: "Signup successful" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//login
router.post("/login", (req, res) => {
  res.send("login");
});

module.exports = router;
