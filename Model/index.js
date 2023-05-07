const mongoose = require("mongoose");
const user = require('./User')
const posts = require('./Posts')

const conString = process.env.NODE_ENV || "development";
const db = {};

db.connection = mongoose.connect(
  `${
    conString == "development" ? "mongodb://127.0.0.1:27017/Freedom" : ""
  }`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

db.user = user
db.posts = posts




module.exports = db
