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
          created_at: roleCreated.created_at,
          updated_at: roleCreated.updated_at,
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
    const roles = await Role.find({})
      .select({
        _id: 0,
        id: "$_id",
        name: "$name",
        created_at: "$created_at",
        updated_at: "$updated_at",
      })
      .skip(skip)
      .limit(10);

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
