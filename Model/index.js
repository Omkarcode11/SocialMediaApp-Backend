const mongoose = require("mongoose");
const user = require('./User')
const posts = require('./Posts')

const conString = process.env.NODE_ENV || "development";
const db = {};


db.user = user
db.posts = posts




module.exports = db
