const express = require("express");
const router = express.Router();

//controllers
const {
  testProduct,
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
//middlewares
const { isLoggedIn, customRole } = require("../middlewares/user");

//GET
router.route("/testProduct").get(testProduct);

// USER
router.route("/getProducts").get(isLoggedIn, getAllProducts);
router.route("/product/:id").get(isLoggedIn, getOneProduct);

// ADMIN
router
  .route("/product/create")
  .post(isLoggedIn, customRole("admin"), createProduct);

router
  .route("/product/:id")
  .put(isLoggedIn, customRole("admin"), updateProduct)
  .delete(isLoggedIn, customRole("admin"), deleteProduct);

module.exports = router;
