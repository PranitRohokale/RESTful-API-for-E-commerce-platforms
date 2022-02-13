const BigPromise = require("../middlewares/bigPromise");

exports.testProduct = BigPromise((req, res, next) => {
  res.status(200).send("This is Test product Route");
});
