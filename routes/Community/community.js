const express = require("express");

const isLogin = require("../../middlewares/isLogin");
const {
  createCommunityController,
  getAllCommunityController,
  getAllCommunityMembersController,
  getOwnedCommunityController,
  getJoinedCommunityController,
} = require("../../controllers/Community/community");
const communityRoutes = express.Router();

communityRoutes.post("/", isLogin, createCommunityController);
communityRoutes.get("/", getAllCommunityController);
communityRoutes.get("/:id/members", getAllCommunityMembersController);
communityRoutes.get("/me/owner", isLogin, getOwnedCommunityController);
communityRoutes.get("/me/member", isLogin, getJoinedCommunityController);

module.exports = communityRoutes;
