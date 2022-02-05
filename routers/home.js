const express = require("express");
const router = express.Router();

// importing controllers
const { home } = require("../controllers/homeController");
// importing middlewares

//routes
router.route("/").get(home);
router.get("/home", home);

module.exports = router;
