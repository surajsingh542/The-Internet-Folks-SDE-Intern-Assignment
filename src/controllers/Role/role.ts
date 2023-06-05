import { prisma } from "../../utils/db.server";
import AppErr from "../../utils/AppErr";
import { Request, Response, NextFunction } from "express";
import { Snowflake } from "@theinternetfolks/snowflake";

const createRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    if (!name || name.length <= 1) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "name",
            message: "Name should be at least 2 characters.",
            code: "INVALID_INPUT",
          },
        ],
      });
    }
    let scopes = [];
    if (name.toLowerCase() === "community admin") {
      scopes = ["member-get", "member-add", "member-remove"];
    } else if (name.toLowerCase() === "community moderator") {
      scopes = ["member-get", "member-remove"];
    } else {
      scopes = ["member-get"];
    }
    const roleCreated = await prisma.role.create({
      data: {
        id: Snowflake.generate().toString(),
        name: name.toLowerCase(),
        scopes,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    res.json({
      status: true,
      content: {
        data: {
          id: roleCreated.id,
          name,
          created_at: roleCreated.createdAt,
          updated_at: roleCreated.updatedAt,
        },
      },
    });
  } catch (error: any) {
    return next(new AppErr(error.message, 500));
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
    const roles = await prisma.role.findMany({
      skip,
      take: 10,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const count = await prisma.role.count();

    res.json({
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
  } catch (error: any) {
    return next(new AppErr(error.message, 500));
  }
};

export { createRoleController, getRolesController };
