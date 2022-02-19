const express = require("express");
const router = express.Router();

//controllers
const { testProduct, createProduct, getAllProducts } = require("../controllers/productController");
//middlewares
const {isLoggedIn,customRole} = require("../middlewares/user")

//GET
router.route("/testProduct").get(testProduct);

// USER 
router.route("/getProducts").get(isLoggedIn,getAllProducts)

// ADMIN 
router.route("/products/create").post(isLoggedIn,customRole('admin'),createProduct)

module.exports = router;
