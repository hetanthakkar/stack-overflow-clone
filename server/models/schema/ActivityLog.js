const mongoose = require("mongoose");
module.exports = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "Login",
        "Logout",
        "Posted Question",
        "Posted Answer",
        "Posted Comment",
        "Upvoted",
        "Downvoted",
        "Flagged Post",
      ],
    },
    targetType: {
      type: String,
      enum: ["Question", "Answer", "Comment", null],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Assuming you have a Comment model
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "ActivityLogs",
  }
);
