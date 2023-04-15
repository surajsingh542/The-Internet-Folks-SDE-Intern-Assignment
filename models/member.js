const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    community: {
      type: String,
      ref: "Community",
    },
    user: {
      type: String,
      ref: "User",
    },
    role: {
      type: String,
      ref: "Role",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// model
const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
