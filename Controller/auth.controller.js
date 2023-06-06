const db = require("./../Model/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const signin = async (req, res) => {
  try {
    let input = req.body;
    let user;

    if (input.type == "email")
      user = await db.user.findOne({ email: input.detail });
    else if (input.type == "phone")
      user = await db.user.findOne({ phone: input.detail });

    if (user == null) {
      res.status(201).send("User not Found");
      res.end();
    } else if (user != null) {
      let isValidPassword = await bcrypt.compare(input.password, user.password);

    
      if (isValidPassword) {
        const secKey = process.env.SECRET_KEY;
        let token = jwt.sign(input, secKey, { expiresIn: "1h" });
        return res.status(200).json({ user, token });
      } else return res.status(200).send("Password is not Wrong");
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
    await db.user.create(userInfo);
    return res.status(201).send("Account Created Successfully");
  } catch (err) {
    return res.status(500).send('internal Error');
  }
};

module.exports = { signup, signin };
