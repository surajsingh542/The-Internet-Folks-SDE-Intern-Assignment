const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
    scopes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// model
const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
