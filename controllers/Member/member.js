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
    const memberFound = await Member.findOne({ community, user });

    if (memberFound) {
      errorFound = true;
      errors.push({
        message: "User is already added in the community.",
        code: "RESOURCE_EXISTS",
      });
    }

    // Community not found
    const communityFound = await Community.findById(community);
    if (!communityFound) {
      errorFound = true;
      errors.push({
        param: "community",
        message: "Community not found.",
        code: "RESOURCE_NOT_FOUND",
      });
    }

    // Role not found
    const roleFound = await Role.findById(role);
    if (!roleFound) {
      errorFound = true;
      errors.push({
        param: "role",
        message: "Role not found.",
        code: "RESOURCE_NOT_FOUND",
      });
    }

    // User not found
    const userFound = await User.findById(user);
    if (!userFound) {
      errorFound = true;
      errors.push({
        param: "user",
        message: "User not found.",
        code: "RESOURCE_NOT_FOUND",
      });
    }

    // Community Admin check
    const communityOwner = await Community.findOne({
      _id: community,
      owner: req.user,
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

    const memberCreated = await Member.create({
      _id: Snowflake.generate().toString(),
      community,
      user,
      role,
    });

    res.json({
      status: true,
      content: {
        data: {
          id: memberCreated._id,
          community: memberCreated.community,
          user: memberCreated.user,
          role: memberCreated.role,
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
    const memberFound = await Member.findById(memberID);
    if (!memberFound) {
      errorFound = true;
      errors.push({
        message: "Member not found.",
        code: "RESOURCE_NOT_FOUND",
      });
    }

    if (memberFound) {
      // Community Admin check
      const communityOwner = await Community.findOne({
        _id: memberFound?.community,
        owner: req.user,
      });
      if (!communityOwner) {
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

    await memberFound.deleteOne({ _id: memberID });
    res.json({ status: true });
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

module.exports = {
  addMemberController,
  removeMemberController,
};
