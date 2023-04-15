const express = require("express");
const {
  createRoleController,
  getRolesController,
} = require("../../controllers/Role/role");

const roleRoutes = express.Router();

roleRoutes.post("/role", createRoleController);
roleRoutes.get("/role", getRolesController);

module.exports = roleRoutes;
