const express = require("express");

// initialize router
const router = express.Router();

// signup
router.post("/signup", (req, res) => {
  res.send("signup");
});

//login
router.post("/login", (req, res) => {
  res.send("login");
});

module.exports = router;
