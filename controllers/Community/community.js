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

    const communityCreated = await Community.create({
      _id: Snowflake.generate().toString(),
      name,
      slug: name.toLowerCase(),
      owner: req.user,
    });

    const roleFound = await Role.findOne({ name: "Community Admin" });

    await Member.create({
      _id: Snowflake.generate().toString(),
      community: communityCreated._id,
      user: communityCreated.owner,
      role: roleFound._id,
    });

    res.json({
      status: true,
      content: {
        data: {
          id: communityCreated._id,
          name: communityCreated.name,
          slug: communityCreated.slug,
          owner: communityCreated.owner,
          created_at: communityCreated.created_at,
          updated_at: communityCreated.updated_at,
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
    const communities = await Community.find({}, { __v: 0 })
      .skip(skip)
      .limit(10)
      .populate({
        path: "owner",
        select: "name",
      });

    const count = await Community.countDocuments({}, { hint: "_id_" });

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
    const members = await Member.find(
      { community: communityID },
      { __v: 0, updated_at: 0 }
    )
      .skip(skip)
      .limit(10)
      .populate({ path: "role", select: "_id name" })
      .populate({ path: "user", select: "_id name" });

    const count = await Member.countDocuments({ community: communityID });

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

    const communitiesOwned = await Community.find(
      { owner: req.user },
      { __v: 0 }
    )
      .skip(skip)
      .limit(10);

    const count = await Community.countDocuments({ owner: req.user });

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

    const members = await Member.find(
      { user: req.user },
      { __v: 0, updated_at: 0, _id: 0, user: 0, role: 0, created_at: 0 }
    )
      .skip(skip)
      .limit(10)
      .populate({
        path: "community",
        select: { __v: 0 },
        populate: {
          path: "owner",
          select: "_id name",
        },
      });

    const count = await Member.countDocuments({ user: req.user });

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
