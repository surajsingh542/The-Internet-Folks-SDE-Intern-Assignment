import express, { Router } from "express";

import {
  userSignUpController,
  userSignInController,
  userDetails,
} from "../../controllers/User/users";

import { isLogin } from "../../middlewares/isLogin";
const userRoutes = express.Router();

userRoutes.post("/signup", userSignUpController);
userRoutes.post("/signin", userSignInController);
userRoutes.get("/me", isLogin, userDetails);

export default userRoutes;
