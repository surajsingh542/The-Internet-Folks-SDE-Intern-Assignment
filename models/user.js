const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      minLength: 2,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
  },
  { timestamps: true }
);

// model
const User = mongoose.model("User", userSchema);

module.exports = User;
