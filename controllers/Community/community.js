const prisma = require("../../prisma/index");
const { Snowflake } = require("@theinternetfolks/snowflake");
const AppErr = require("../../utils/AppErr");
const Community = require("../../models/community");
const Member = require("../../models/member");
const Role = require("../../models/role");

const createCommunityController = async (req, res, next) => {
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
      return res.status(400).json({
        status: false,
        errors,
      });
    }

    const communityCreated = await prisma.community.create({
      data: {
        id: Snowflake.generate().toString(),
        name,
        slug: name.toLowerCase(),
        owner: { connect: { id: req.user } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // console.log("Community Created", communityCreated);
    // return res.json("success");

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

    res.json({
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
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

const getAllCommunityController = async (req, res, next) => {
  try {
    let { page } = req.query;
    if (!page) page = 1;
    const skip = (page - 1) * 10;
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
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

const getAllCommunityMembersController = async (req, res, next) => {
  try {
    let { page } = req.query;
    if (!page) page = 1;
    const skip = (page - 1) * 10;

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
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

const getOwnedCommunityController = async (req, res, next) => {
  try {
    let { page } = req.query;
    if (!page) page = 1;
    const skip = (page - 1) * 10;

    const communitiesOwned = await prisma.community.findMany({
      where: {
        ownerId: req.user,
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
      where: { ownerId: req.user },
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
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

const getJoinedCommunityController = async (req, res, next) => {
  try {
    let { page } = req.query;
    if (!page) page = 1;
    const skip = (page - 1) * 10;

    const members = await prisma.member.findMany({
      where: { userId: req.user },
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

    const count = await prisma.member.count({ where: { userId: req.user } });

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
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

module.exports = {
  createCommunityController,
  getAllCommunityController,
  getAllCommunityMembersController,
  getOwnedCommunityController,
  getJoinedCommunityController,
};
