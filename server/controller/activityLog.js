// import UserModel from '../model/User.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import ENV from '../config.js';
// import otpGenerator from 'otp-generator';

const User = require("../models/schema/User.js");
const ActivityLog = require("../models/ActivityLog");

exports.createActivityLog = async (
  userId,
  action,
  targetType = null,
  targetId = null,
  commentId = null
) => {
  try {
    const activityLog = new ActivityLog({
      user: userId,
      action,
      targetType,
      targetId,
      commentId,
    });
    await activityLog.save();
  } catch (error) {
    console.error("Error creating activity log:", error);
  }
};
exports.getUserActivityLog = async (req, res) => {
  try {
    const { userId } = req.params;
    // Verify user exists and requester has permission
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if requester is the user or a moderator
    const isAuthorizedToView =
      user._id.toString() === userId || user.isModerator;

    if (!isAuthorizedToView) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this activity log" });
    }

    // Fetch activity logs with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const activityLogs = await ActivityLog.find({ user: userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate("targetId", "title text") // Populate parent target details
      .populate("commentId", "text") // Populate comment details
      .populate({
        path: "targetType",
        select: "title text",
      });

    const total = await ActivityLog.countDocuments({ user: userId });

    res.json({
      activityLogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalLogs: total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving activity logs",
      error: error.message,
    });
  }
};

exports.logQuestionActivity = async (req, res, next) => {
  try {
    // Log question creation
    await exports.createActivityLog(
      req.user._id,
      "Posted Question",
      "Question",
      req.question._id
    );
    next();
  } catch (error) {
    next(error);
  }
};
