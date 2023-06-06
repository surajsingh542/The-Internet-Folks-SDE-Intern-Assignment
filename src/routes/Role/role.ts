import express, { Router } from "express";

import {
  createRoleController,
  getRolesController,
} from "../../controllers/Role/role";
import validateDto from "../../middlewares/Validate";
import { addRoleSchema } from "../../ajvValidators/roleSchema";

const roleRoutes = express.Router();

roleRoutes.post("/role", validateDto(addRoleSchema), createRoleController);
roleRoutes.get("/role", getRolesController);

export default roleRoutes;
