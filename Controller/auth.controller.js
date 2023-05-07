const db = require("./../Model/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const signin = async (req, res) => {
  try {
    let input = req.body;
    let user = await db.user.findOne({ name: input.name });

    if (user == null) {
      res.status(201).send("User not Found");
      res.end();
    } else if (user != null) {
      let isValidPassword = await bcrypt.compare(input.password, user.password);

      if (isValidPassword) {
        const secKey = process.env.SECRET_KEY;
        let token = jwt.sign(input, secKey, { expiresIn: "1h" });

        res.status(200).send(token);
      } else res.status(401).send("Password is not Wrong");

      res.end();
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
    res.end();
  }
};

const signup = async (req, res) => {
  try {
    let userInfo = req.body;
    let hash = await bcrypt.hash(userInfo.password, 10);
    userInfo.password = hash;
    let user = await db.user.create(userInfo);
    // await user.save()
    res.status(200).json({ user: user, msg: "user Created Successfully" });
    res.end();
  } catch (err) {
    res.status(400).json({ err: err, msg: "Err" });
    res.end();
  }
};

module.exports = { signup, signin };
