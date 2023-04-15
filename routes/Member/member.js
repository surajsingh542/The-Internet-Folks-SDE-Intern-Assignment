const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const {
  addMemberController,
  removeMemberController,
} = require("../../controllers/Member/member");
const memberRoutes = express.Router();

memberRoutes.post("/", isLogin, addMemberController);
memberRoutes.delete("/:id", isLogin, removeMemberController);

module.exports = memberRoutes;
