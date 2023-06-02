const prisma = require("../../prisma/index");
const AppErr = require("../../utils/AppErr");
const Member = require("../../models/member");
const Community = require("../../models/community");
const Role = require("../../models/role");
const User = require("../../models/user");
const { Snowflake } = require("@theinternetfolks/snowflake");

const addMemberController = async (req, res, next) => {
  try {
    const { community, user, role } = req.body;

    let errorFound = false;
    let errors = [];

    // Member already added
    const memberFound = await prisma.member.findUnique({
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

    const communityOwner = await prisma.community.findUnique({
      where: {
        id: community,
        ownerId: req.user,
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
      return res.status(400).json({
        status: false,
        errors,
      });
    }

    const memberCreated = await prisma.member.create({
      data: {
        id: Snowflake.generate().toString(),
        community: { connect: { id: community } },
        user: { connect: { id: user } },
        role: { connect: { id: role } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
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
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

const removeMemberController = async (req, res, next) => {
  try {
    const memberID = req.params.id;

    let errorFound = false;
    let errors = [];

    // member not found error
    const memberFound = await prisma.member.findUnique({
      where: {
        id: memberID,
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

      // const communityOwner = await Community.findOne({
      //   _id: memberFound?.community,
      //   owner: req.user,
      // });
      const communityOwner = await prisma.community.findUnique({
        where: {
          id: memberFound?.communityId,
          ownerId: req.user,
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

      // const moderatorFound = await Member.findOne({
      //   community: memberFound?.community,
      //   role: roleFound._id,
      //   user: req.user,
      // });

      const moderatorFound = await prisma.member.findUnique({
        communityId: memberFound?.communityId,
        roleId: roleFound.id,
        userId: req.user,
      });

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
      return res.status(400).json({
        status: false,
        errors,
      });
    }

    // await memberFound.deleteOne({ _id: memberID });
    await prisma.member.delete({
      where: {
        id: memberID,
      },
    });
    res.json({ status: true });
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

module.exports = {
  addMemberController,
  removeMemberController,
};
