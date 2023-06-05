import express, { Router } from "express";

import {
  userSignUpController,
  userSignInController,
  userDetails,
} from "../../controllers/User/users";

const isLogin = require("../../middlewares/isLogin");
const userRoutes: Router = express.Router();

userRoutes.post("/signup", userSignUpController);
userRoutes.post("/signin", userSignInController);
userRoutes.get("/me", isLogin, userDetails);

export default userRoutes;
