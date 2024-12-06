const mongoose = require("mongoose");

const ActivityLog = require("./schema/ActivityLog");

module.exports = mongoose.model("ActivityLog", ActivityLog);
