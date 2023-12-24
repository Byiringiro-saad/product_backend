const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

// controllers
const authController = require("./controllers/auth.controller");
const productController = require("./controllers/product.controller");

// middlewares
const authMiddleware = require("./middlewares/auth.middleware");

// initialize express
const app = express();

// database
require("./services/db.service");

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/auth", authController);
app.use("/api/products", authMiddleware, productController);

// port
const PORT = process.env.PORT || 8000;

// listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
