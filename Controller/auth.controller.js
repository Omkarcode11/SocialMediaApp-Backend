const db = require("./../Model/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signin = async (req, res) => {
  try {
    let input = req.body;
    let user;

    if (input.type == "email")
      user = await db.user.findOne({ email: input.detail });
    else if (input.type == "phone")
      user = await db.user.findOne({ phone: input.detail });

    if (user == null) {
      return res.status(201).send("User not Found");

    } else if (user != null) {
      let isValidPassword = await bcrypt.compare(input.password, user.password);


      if (isValidPassword) {
        const secKey = process.env.SECRET_KEY;

        let token = jwt.sign({ id: user.id }, secKey, { expiresIn: "1h" });
        res.status(200).send({ user, token });
        res.end()
      } else return res.status(200).send("Password is Wrong");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send('internal error');

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
