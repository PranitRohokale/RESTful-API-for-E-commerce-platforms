const BigPromise = require("../middlewares/bigPromise");
const CustomeError = require("../utils/customerError");
const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!(name && email && password)) {
    return next(new CustomeError("Name , email and Password Required", 400));
  }

  //creating user
  const user = await User.create({
    email,
    name,
    password,
  });

  cookieToken(res,user)
});
