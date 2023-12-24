const express = require("express");

// initialize router
const router = express.Router();

// database
const db = require("../services/db.service");

// add product
router.post("/", (req, res) => {
  const data = {
    name: req.body.name,
    price: parseInt(req.body.price),
    description: req.body.description,
  };

  try {
    // save product to database (calling the procedure)
    const query = `CALL products.usp_ins_product(?, ?, ?)`;
    const values = [data.name, data.description, data.price];
    db.query(query, values);

    // return response
    res.status(200).json({ message: "Product added" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all products
router.get("/", (req, res) => {
  try {
    // get all products from database (calling the procedure)
    const query = `CALL products.usp_list_product()`;
    db.query(query, (err, result) => {
      if (err) throw err;

      // return response
      res.status(200).json({ products: result[0] });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// get single product
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // get single product from database (calling the procedure)
    const query = `CALL products.usp_get_product(?)`;
    db.query(query, [id], (err, result) => {
      if (err) throw err;

      // return response
      res.status(200).json({ product: result[0] });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// update product
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const data = {
    name: req.body.name,
    price: parseInt(req.body.price),
    description: req.body.description,
  };

  try {
    // update product in database (calling the procedure)
    const query = `CALL products.usp_upd_product(?, ?, ?, ?)`;
    const values = [id, data.name, data.description, data.price];
    db.query(query, values);

    // return response
    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete product
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // delete product from database (calling the procedure)
    const query = `CALL products.usp_del_product(?)`;
    db.query(query, [id]);

    // return response
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
