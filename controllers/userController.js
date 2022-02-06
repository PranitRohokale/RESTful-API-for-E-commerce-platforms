const BigPromise = require("../middlewares/bigPromise");
const CustomeError = require("../utils/customerError");
const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");

exports.signup = BigPromise(async (req, res, next) => {
  let photoResult;

  if (req.files) {
    const file = req.files.photo;
    photoResult = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }

  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    return next(new CustomeError("Name , email and Password Required", 400));
  }

  //creating user
  const user = await User.create({
    email,
    name,
    password,
    photo: {
      id: photoResult.public_id,
      secure_url: photoResult.secure_url,
    },
  });
  user.password = undefined;
  cookieToken(res, user);
});
