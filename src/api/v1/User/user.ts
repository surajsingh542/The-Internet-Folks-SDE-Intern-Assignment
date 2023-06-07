import express, { Router } from "express";

import {
  userSignUpController,
  userSignInController,
  userDetails,
} from "../../../controllers/v1/User/users";

import { isLogin } from "../../../middlewares/isLogin";
import validateDto from "../../../middlewares/Validate";
import {
  userSignUpSchema,
  userSignInSchema,
} from "../../../schema/v1/userSchema";

const userRoutes = express.Router();

userRoutes.post("/signup", validateDto(userSignUpSchema), userSignUpController);
userRoutes.post("/signin", validateDto(userSignInSchema), userSignInController);
userRoutes.get("/me", isLogin, userDetails);

export default userRoutes;
