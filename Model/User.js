const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: String,
  name: String,
  email: String,
  password: String,
  phone: Number,
  myPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
  myFriends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendReq: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sendFriendReq: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
  createdAt: [
    {
      type: Date,
      default: Date.now,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
