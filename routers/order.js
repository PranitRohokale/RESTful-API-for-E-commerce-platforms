const {
  createOrder,
  getOneOrder,
  getMyOrders,
  admingetAllOrders,
  adminUpdateOrder,
  adminDeleteOrder,
} = require("../controllers/orderController");

const { isLoggedIn, customRole } = require("../middlewares/user");

const router = require("express").Router();

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/myorder").get(isLoggedIn, getMyOrders);

// admin routes
router
  .route("/admin/orders")
  .get(isLoggedIn, customRole("admin"), admingetAllOrders);

router
  .route("/admin/order/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOrder)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOrder);

module.exports = router;
