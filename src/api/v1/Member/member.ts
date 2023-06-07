import express, { Router } from "express";
import { isLogin } from "../../../middlewares/isLogin";
import {
  addMemberController,
  removeMemberController,
} from "../../../controllers/v1/Member/member";
import validateDto from "../../../middlewares/Validate";
import { addMemberSchema } from "../../../schema/v1/memberSchema";

const memberRoutes = express.Router();

memberRoutes.post(
  "/",
  validateDto(addMemberSchema),
  isLogin,
  addMemberController
);
memberRoutes.delete("/:id", isLogin, removeMemberController);

export default memberRoutes;
