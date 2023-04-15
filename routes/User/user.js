const express = require("express");
const {
  userSignUpController,
  userSignInController,
  userDetails,
} = require("../../controllers/User/users");
const isLogin = require("../../middlewares/isLogin");
const userRoutes = express.Router();

userRoutes.post("/signup", userSignUpController);
userRoutes.post("/signin", userSignInController);
userRoutes.get("/me", isLogin, userDetails);

module.exports = userRoutes;
