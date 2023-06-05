import express, { Router } from "express";
import { isLogin } from "../../middlewares/isLogin";
import {
  addMemberController,
  removeMemberController,
} from "../../controllers/Member/member";

const memberRoutes: Router = express.Router();

memberRoutes.post("/", isLogin, addMemberController);
memberRoutes.delete("/:id", isLogin, removeMemberController);

export default memberRoutes;
