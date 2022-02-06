const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [40, "at most 40 charters in name"],
    required: [true, "field name is missing"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "please enter email in correct format"],
    required: [true, "field email is missing"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is missing"],
    minlength: [6, "password should be at least 6 char"],
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: false,
    },
    secure_url: {
      type: String,
      required: false,
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now, // not include () we dont want to run it now
  },
});

//encrypt pass before save
userSchema.pre("save", async function (next) {
  if (this.isModified("password") == false) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passed password
userSchema.methods.isValidatedPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//method for create & return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

//get forgot password token(string)
//can use uuid/nanoid packages
// here using crypto default node package
userSchema.methods.getForgotPasswordToken = function () {
  //generate long random string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  //getting hash - make sure to get hash in backend for verification
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  // time of token
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
