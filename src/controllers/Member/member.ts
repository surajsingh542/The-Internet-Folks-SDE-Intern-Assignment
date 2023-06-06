import { prisma } from "../../utils/db.server";
import { PlatformError } from "../../CustomErrors/PlatfotmError";
import { Request, Response, NextFunction } from "express";
import { Snowflake } from "@theinternetfolks/snowflake";
import * as MemberService from "./member.service";

const addMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { community, user, role } = req.body;

    let errorFound = false;
    let errors = [];

    // Member already added
    const memberFound = await prisma.member.findFirst({
      where: { communityId: community, userId: user },
    });

    if (memberFound) {
      errorFound = true;
      errors.push({
        message: "User is already added in the community.",
        code: "RESOURCE_EXISTS",
      });
    }

    // Community not found
    const communityFound = await prisma.community.findUnique({
      where: {
        id: community,
      },
    });
    if (!communityFound) {
      errorFound = true;
      errors.push({
        param: "community",
        message: "Community not found.",
        code: "RESOURCE_NOT_FOUND",
      });
    }

    // Role not found
    const roleFound = await prisma.role.findUnique({
      where: {
        id: role,
      },
    });

    if (!roleFound) {
      errorFound = true;
      errors.push({
        param: "role",
        message: "Role not found.",
        code: "RESOURCE_NOT_FOUND",
      });
    }

    // User not found
    const userFound = await prisma.user.findUnique({
      where: {
        id: user,
      },
    });

    if (!userFound) {
      errorFound = true;
      errors.push({
        param: "user",
        message: "User not found.",
        code: "RESOURCE_NOT_FOUND",
      });
    }

    // Community Admin check

    const communityOwner = await prisma.community.findFirst({
      where: {
        id: community,
        ownerId: res.locals.user,
      },
    });

    if (!communityOwner) {
      errorFound = true;
      errors.push({
        message: "You are not authorized to perform this action.",
        code: "NOT_ALLOWED_ACCESS",
      });
    }

    if (errorFound) {
      throw new PlatformError(errors);
    }

    const memberCreated = await MemberService.addMember({
      communityId: community,
      userId: user,
      roleId: user,
    });

    console.log(memberCreated);

    res.json({
      status: true,
      content: {
        data: {
          id: memberCreated.id,
          community: memberCreated.communityId,
          user: memberCreated.userId,
          role: memberCreated.roleId,
          created_at: memberCreated.createdAt,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};

const removeMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberID: string = req.params.id;

    let errorFound = false;
    let errors = [];

    // member not found error
    const memberFound = await prisma.member.findUnique({
      where: {
        id: memberID,
      },
      select: {
        communityId: true,
      },
    });

    if (!memberFound) {
      errorFound = true;
      errors.push({
        message: "Member not found.",
        code: "RESOURCE_NOT_FOUND",
      });
    }

    let isOwnerFound = false;
    let isModeratorPresent = false;

    if (memberFound) {
      // Community Admin check
      const communityOwner = await prisma.community.findFirst({
        where: {
          id: memberFound?.communityId,
          ownerId: res.locals.user,
        },
      });

      if (communityOwner) {
        isOwnerFound = true;
      }

      // const roleFound = await Role.findOne({ name: "community moderator" });
      const roleFound = await prisma.role.findUnique({
        where: {
          name: "community moderator",
        },
      });

      // community moderator check

      let moderatorFound = null;
      if (roleFound) {
        moderatorFound = await prisma.member.findFirst({
          where: {
            communityId: memberFound.communityId,
            roleId: roleFound.id,
            userId: res.locals.user,
          },
        });
      }

      if (moderatorFound) {
        isModeratorPresent = true;
      }

      if (!isOwnerFound && !isModeratorPresent) {
        errorFound = true;
        errors.push({
          message: "You are not authorized to perform this action.",
          code: "NOT_ALLOWED_ACCESS",
        });
      }
    }

    if (errorFound) {
      throw new PlatformError(errors);
    }

    // await memberFound.deleteOne({ _id: memberID });
    await prisma.member.delete({
      where: {
        id: memberID,
      },
    });
    res.json({ status: true });
  } catch (error: any) {
    next(error);
  }
};

export { addMemberController, removeMemberController };
