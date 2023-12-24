const express = require("express");

// initialize router
const router = express.Router();

// add product
router.post("/", (req, res) => {
  res.send("add product");
});

// get all products
router.get("/", (req, res) => {
  res.send("get all products");
});

// get single product
router.get("/:id", (req, res) => {
  res.send("get single product");
});

// update product
router.put("/:id", (req, res) => {
  res.send("update product");
});

// delete product
router.delete("/:id", (req, res) => {
  res.send("delete product");
});

module.exports = router;
