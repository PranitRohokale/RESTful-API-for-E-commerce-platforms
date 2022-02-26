const express = require("express");
const router = express.Router();

const {
  sendRazorpayKey,
  captureRazorpayPayment,
} = require("../controllers/paymentController");

const { isLoggedIn } = require("../middlewares/user");

router.route("/stripekey").get(isLoggedIn, sendRazorpayKey);
router.route("/capturerazorpay").post(isLoggedIn, captureRazorpayPayment);

module.exports = router;
