const express = require("express");
const router = express.Router();

//controllers
const { testProduct } = require("../controllers/productController");
//middlewares

//GET
router.route("/testProduct").get(testProduct);

module.exports = router;
