import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../universe/v1/utils/db.server";
import { Snowflake } from "@theinternetfolks/snowflake";
import * as CommunityService from "../../../services/v1/Community/community.service";
import { PlatformError } from "../../../CustomErrors/PlatfotmError";
export const createCommunityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    let errorFound = false;
    let errors = [];

    if (!name || name.length < 2) {
      errorFound = true;
      errors.push({
        param: "name",
        message: "Name should be at least 2 characters.",
        code: "INVALID_INPUT",
      });
    }

    if (errorFound) {
      throw new PlatformError(errors);
    }

    const communityCreated = await CommunityService.createCommunity({
      name,
      ownerId: res.locals.user,
    });

    const roleFound = await prisma.role.findUnique({
      where: {
        name: "community admin",
      },
    });

    if (!roleFound) {
      const roleCreated = await prisma.role.create({
        data: {
          id: Snowflake.generate(),
          name: "community admin",
          scopes: ["member-get", "member-add", "member-remove"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await prisma.member.create({
        data: {
          id: Snowflake.generate().toString(),
          community: { connect: { id: communityCreated.id } },
          user: { connect: { id: communityCreated.ownerId } },
          role: { connect: { id: roleCreated.id } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.member.create({
        data: {
          id: Snowflake.generate().toString(),
          community: { connect: { id: communityCreated.id } },
          user: { connect: { id: communityCreated.ownerId } },
          role: { connect: { id: roleFound.id } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return res.json({
      status: true,
      content: {
        data: {
          id: communityCreated.id,
          name: communityCreated.name,
          slug: communityCreated.slug,
          owner: communityCreated.ownerId,
          created_at: communityCreated.createdAt,
          updated_at: communityCreated.updatedAt,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAllCommunityController = async (
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
    const communities = await prisma.community.findMany({
      skip,
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    const count = await prisma.community.count();

    res.json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / 10),
          page: page,
        },
        data: communities,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAllCommunityMembersController = async (
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

    const communityID = req.params.id;

    const members = await prisma.member.findMany({
      where: { communityId: communityID },
      skip,
      take: 10,
      select: {
        id: true,
        communityId: true,
        user: {
          select: { id: true, name: true },
        },
        role: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    const count = await prisma.member.count({
      where: { communityId: communityID },
    });

    res.json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / 10),
          page: page,
        },
        data: members,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const getOwnedCommunityController = async (
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

    const communitiesOwned = await prisma.community.findMany({
      where: {
        ownerId: res.locals.user,
      },
      skip,
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const count = await prisma.community.count({
      where: { ownerId: res.locals.user },
    });

    res.json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / 10),
          page: page,
        },
        data: communitiesOwned,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const getJoinedCommunityController = async (
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

    const members = await prisma.member.findMany({
      where: { userId: res.locals.user },
      skip,
      take: 10,
      select: {
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
            owner: { select: { id: true, name: true } },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const count = await prisma.member.count({
      where: { userId: res.locals.user },
    });

    const formattedMembers = members.map((member) => {
      return member.community;
    });

    res.json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / 10),
          page: page,
        },
        data: formattedMembers,
      },
    });
  } catch (error: any) {
    next(error);
  }
};
