const express = require("express");
const app = express();
const db = require("./Model/index");
const router = require("./Router/index");
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config()

mongoose.connect(process.env.DB_URL)

let conn = mongoose.connection

conn.on('err', () => {
  console.log("db is not connected")
})
conn.once("open", () => {
  console.log('db connected successfully')
})

app.use(cors())
app.use(express.json());
app.use(express.json({ extended: false }))

app.use(router);

app.get("/", (req, res) => {
  res.status(200).send("homePage");
  res.end();
});

app.listen(8008, () => {
  console.log("running on port 8008");
});
