const mongoose = require("mongoose");

const db = mongoose
  .connect("mongodb://127.0.0.1/TokenRotation")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

module.exports = db;
