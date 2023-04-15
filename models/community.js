const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// model
const Community = mongoose.model("Community", communitySchema);
module.exports = Community;
