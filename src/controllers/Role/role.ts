import { prisma } from "../../utils/db.server";
import { PlatformError } from "../../CustomErrors/PlatfotmError";
import { Request, Response, NextFunction } from "express";
import { Snowflake } from "@theinternetfolks/snowflake";
import * as RoleService from "./role.service";

const createRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    if (!name || name.length <= 1) {
      throw new PlatformError([
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ]);
    }
    let scopes = [];
    if (name.toLowerCase() === "community admin") {
      scopes = ["member-get", "member-add", "member-remove"];
    } else if (name.toLowerCase() === "community moderator") {
      scopes = ["member-get", "member-remove"];
    } else {
      scopes = ["member-get"];
    }

    const roleCreated = await RoleService.createRole({ name }, scopes);

    res.json({
      status: true,
      content: {
        data: {
          id: roleCreated.id,
          name: roleCreated.name,
          created_at: roleCreated.createdAt,
          updated_at: roleCreated.updatedAt,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};

const getRolesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let page: number;
    if (!req.query.page) {
      page = 1;
    } else {
      page = parseInt(req.query.page as string, 10);
    }
    const skip: number = (page - 1) * 10;

    const roles = await RoleService.listRoles(skip);

    const count = await prisma.role.count();
    if (roles) {
      return res.json({
        status: true,
        content: {
          meta: {
            total: count,
            pages: Math.ceil(count / 10),
            page: page,
          },
          data: roles,
        },
      });
    } else {
      throw new PlatformError([
        {
          message: "No role exist.",
        },
      ]);
    }
  } catch (error: any) {
    next(error);
  }
};

export { createRoleController, getRolesController };
