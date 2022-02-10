const BigPromise = require("../middlewares/bigPromise");
const CustomeError = require("../utils/customerError");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.header("Authorization")
      ? req.header("Authorization").replace("Bearer ", "")
      : undefined);

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  if (!(decode && decode.id)) {
    return next(
      new CustomeError("Token Expired or invalid , Login again..", 400)
    );
  }
  const user = await User.findById({ _id: decode.id });
  if (!user)
    return next(new CustomeError("User no more exits in system..", 400));

  req.user = user;
  next();
});

exports.customRole = (...roles) => {
  // console.log(roles);
  // console.log(...roles);
  return (req, res, next) => {
    if (roles.includes(req.user.role)) next();
    else return next(new CustomeError('user Not authenticate',403))
  };
};
