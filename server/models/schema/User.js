const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide Unique username"],
    unique: [true, "Username Exists"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },
  email: {
    type: String,

    required: [true, "Please provide an email"],
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: Number },
  address: { type: String },
  profile: { type: String },
  isModerator: { type: Boolean, default: false },
});

const User = mongoose.model.Users || mongoose.model("User", UserSchema);
module.exports = User;
