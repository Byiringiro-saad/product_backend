const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");

// load env variables
require("dotenv").config();

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
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    // check if user exists
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [data.email], async (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        res.status(401).json({ message: "Invalid credentials" });
      } else {
        // compare password
        bcrypt.compare(data.password, result[0].password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            // create token
            const token = jwt.sign(
              { id: result[0].id, email: result[0].email },
              process.env.SECRET,
              { expiresIn: "1h" }
            );

            // return response
            res.status(200).json({ token });
          } else {
            res.status(401).json({ message: "Invalid credentials" });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
