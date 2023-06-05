import express, { Router } from "express";

import { isLogin } from "../../middlewares/isLogin";
import {
  createCommunityController,
  getAllCommunityController,
  getAllCommunityMembersController,
  getOwnedCommunityController,
  getJoinedCommunityController,
} from "../../controllers/Community/community";

const communityRoutes: Router = express.Router();

communityRoutes.post("/", isLogin, createCommunityController);
communityRoutes.get("/", getAllCommunityController);
communityRoutes.get("/:id/members", getAllCommunityMembersController);
communityRoutes.get("/me/owner", isLogin, getOwnedCommunityController);
communityRoutes.get("/me/member", isLogin, getJoinedCommunityController);

export default communityRoutes;
