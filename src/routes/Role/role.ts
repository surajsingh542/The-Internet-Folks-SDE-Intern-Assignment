import express, { Router } from "express";

import {
  createRoleController,
  getRolesController,
} from "../../controllers/Role/role";

const roleRoutes: Router = express.Router();

roleRoutes.post("/role", createRoleController);
roleRoutes.get("/role", getRolesController);

export default roleRoutes;