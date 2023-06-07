import express, { Router } from "express";

import { isLogin } from "../../../middlewares/isLogin";
import {
  createCommunityController,
  getAllCommunityController,
  getAllCommunityMembersController,
  getOwnedCommunityController,
  getJoinedCommunityController,
} from "../../../controllers/v1/Community/community";
import validateDto from "../../../middlewares/Validate";
import { createCommunitySchema } from "../../../schema/v1/communitySchema";

const communityRoutes = express.Router();

communityRoutes.post(
  "/",
  validateDto(createCommunitySchema),
  isLogin,
  createCommunityController
);
communityRoutes.get("/", getAllCommunityController);
communityRoutes.get("/:id/members", getAllCommunityMembersController);
communityRoutes.get("/me/owner", isLogin, getOwnedCommunityController);
communityRoutes.get("/me/member", isLogin, getJoinedCommunityController);

export default communityRoutes;