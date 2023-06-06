import express, { Router } from "express";
import { isLogin } from "../../middlewares/isLogin";
import {
  addMemberController,
  removeMemberController,
} from "../../controllers/Member/member";
import validateDto from "../../middlewares/Validate";
import { addMemberSchema } from "../../ajvValidators/memberSchema";

const memberRoutes = express.Router();

memberRoutes.post(
  "/",
  validateDto(addMemberSchema),
  isLogin,
  addMemberController
);
memberRoutes.delete("/:id", isLogin, removeMemberController);

export default memberRoutes;
