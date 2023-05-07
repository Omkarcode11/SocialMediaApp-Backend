const express = require("express");
const app = express();
const db = require("./Model/index");
const router = require("./Router/index");

db.connection
  .then((res) => console.log("success connected to db"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use(router);
app.get("/", (req, res) => {
  res.status(200).send("homePage");
  res.end();
});

app.listen(8008, () => {
  console.log("running on port 8008");
});
