const express = require("express");
const { dbCall } = require("../services/db.service");

// initialize router
const router = express.Router();

// add product
router.post("/", (req, res) => {
  const data = {
    name: req.body.name,
    price: parseInt(req.body.price),
    description: req.body.description,
  };

  try {
    // params
    const values = [data.name, data.description, data.price];

    // call dbcall
    dbCall("usp_ins_product", values, (err, result) => {
      if (err) throw err;

      // return response
      res.status(200).json({ message: "Product added" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all products
router.get("/", (req, res) => {
  try {
    // call dbcall
    dbCall("usp_list_product", null, (err, result) => {
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
    // call dbcall
    dbCall("usp_get_product", [id], (err, result) => {
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
    // params
    const values = [id, data.name, data.description, data.price];

    // call dbcall
    dbCall("usp_upd_product", values, (err, result) => {
      if (err) throw err;

      // return response
      res.status(200).json({ message: "Product updated" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete product
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // call dbcall
    dbCall("usp_del_product", [id], (err, result) => {
      if (err) throw err;

      // return response
      res.status(200).json({ message: "Product deleted" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
