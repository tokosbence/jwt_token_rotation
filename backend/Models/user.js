const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 1024,
  },
  refreshtoken: [String],
});

userSchema.methods.generateAuthToken = function () {
  const accesstoken = jwt.sign(
    { _id: this._id },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "10s",
    }
  );
  const refreshtoken = jwt.sign(
    { _id: this._id },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "1d" }
  );

  const tokens = { accesstoken: accesstoken, refreshtoken: refreshtoken };
  return tokens;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
