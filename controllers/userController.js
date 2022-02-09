const BigPromise = require("../middlewares/bigPromise");
const CustomeError = require("../utils/customerError");
const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const emailHelper = require("../utils/emailHelper");
const crypto = require('crypto')

exports.signup = BigPromise(async (req, res, next) => {
  let photoResult;

  const { name, email, password } = req.body;

  if (!(name && email && password && req.files)) {
    return next(
      new CustomeError("Name , email ,photo and Password Required", 400)
    );
  }
  // get user from DB
  const isUserExists = await User.findOne({ email }).select("+password");

  // if user not found in DB
  if (isUserExists) {
    return next(new CustomeError("User already exist!", 400));
  }

  if (req.files) {
    const file = req.files.photo;
    photoResult = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
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

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // check for presence of email and password
  if (!email || !password) {
    return next(new CustomeError("please provide email and password", 400));
  }

  // get user from DB
  const user = await User.findOne({ email }).select("+password");

  // if user not found in DB
  if (!user) {
    return next(
      new CustomeError("Email or password does not match or exist", 400)
    );
  }

  // match the password
  const isPasswordCorrect = await user.isValidatedPassword(password);

  //if password do not match
  if (!isPasswordCorrect) {
    return next(
      new CustomeError("Email or password does not match or exist", 400)
    );
  }

  // if all goes good and we send the token
  cookieToken(res, user);
});

exports.logout = BigPromise(async (req, res, next) => {
  //clear the cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  //send JSON response for success
  res.status(200).json({
    succes: true,
    message: "Logout success",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new CustomeError("Email not found as register", 400));

  const forgotToken = user.getForgotPasswordToken();
  await user.save({ validateBeforeSave: true });

  try {
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;
    const message = `visit this url to forgot your password \t ${url}`;

    emailHelper({
      toEmail: "rohokalepranit@gmail.com",
      subject: "Tshirt Store - Forgot email ",
      text: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sended to user email : ${user.email}`,
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: true });

    return next(new CustomeError(error.message, 500));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(
      new CustomeError("password & Confirm PAssword not matched", 400)
    );
  }
  const forgotToken = req.params.token;
  const encrypToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  const user = await User.findOne({
    encrypToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomeError("Token Expired or invalid", 400));
  }

  user.password = password
  user.forgotPasswordExpiry = undefined
  user.forgotPasswordToken = undefined
  
  await user.save();

  cookieToken(res,user)
});

