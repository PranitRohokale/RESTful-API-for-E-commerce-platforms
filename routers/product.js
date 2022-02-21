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
  addReview,
  getAllReviewsOfOneProduct,
  deleteReview,
} = require("../controllers/productController");
//middlewares
const { isLoggedIn, customRole } = require("../middlewares/user");

//GET
router.route("/testProduct").get(testProduct);
router.route("/getProducts").get( getAllProducts);
router.route("/product/:id").get( getOneProduct);
router.route("/product/review/all").get(getAllReviewsOfOneProduct); // productId expect in query

// USER
router.route("/product/:id/review").put(isLoggedIn, addReview);
router.route("/product/:id/review").delete(isLoggedIn, deleteReview);

// ADMIN
router
  .route("/product/create")
  .post(isLoggedIn, customRole("admin"), createProduct);

router
  .route("/product/:id")
  .put(isLoggedIn, customRole("admin"), updateProduct)
  .delete(isLoggedIn, customRole("admin"), deleteProduct);

module.exports = router;
