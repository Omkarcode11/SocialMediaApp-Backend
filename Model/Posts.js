const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  caption: String,
  photo: String,
  comments: [{ type: mongoose.Schema.Types.Map, name: String, body: String }],
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
});

module.exports = mongoose.model("Posts", postSchema);
