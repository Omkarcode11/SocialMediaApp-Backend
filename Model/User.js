const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String
  ,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  phone: {
    type: Number,
    unique: true,
  },
  avatar: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
