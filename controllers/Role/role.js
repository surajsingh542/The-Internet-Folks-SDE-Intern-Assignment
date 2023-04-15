const AppErr = require("../../utils/AppErr");
const Role = require("../../models/role");
const { Snowflake } = require("@theinternetfolks/snowflake");

const createRoleController = async (req, res, next) => {
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
    } else {
      scopes = ["member-get"];
    }
    const roleCreated = await Role.create({
      _id: Snowflake.generate(),
      name,
      scopes,
    });
    res.json({
      status: true,
      content: {
        data: {
          id: roleCreated._id,
          name: roleCreated.name,
          created_at: roleCreated.createdAt,
          updated_at: roleCreated.updatedAt,
        },
      },
    });
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

const getRolesController = async (req, res, next) => {
  try {
    let { page } = req.query;
    if (!page) page = 1;
    const skip = (page - 1) * 10;
    const roles = await Role.find({}, { __v: 0 }).skip(skip).limit(10);

    const count = await Role.countDocuments({}, { hint: "_id_" });

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
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

module.exports = {
  createRoleController,
  getRolesController,
};
