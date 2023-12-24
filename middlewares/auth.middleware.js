const express = require("express");
const jwt = require("jsonwebtoken");

// initialize router
const router = express.Router();

router.use("/", (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    jwt.verify(token.split(" ")[1], process.env.SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
});

module.exports = router;
