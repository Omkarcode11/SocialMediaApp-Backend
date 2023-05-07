let emailValidator = require("email-validator");
let passWordValidator = require("password-validator");
const mongoose = require("mongoose");

let schema = new passWordValidator();

schema
  .is()
  .min(5)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .has()
  .symbols();

const signupValidation = (req, res, next) => {
  req.body.name = req.body.name.trim();
  req.body.userName = req.body.userName.trim();
  if (req.body.name.length <= 1)
    return res.status(401).send("name is not Valid");
  else if (req.body.userName.length <= 1)
    return res.status(401).send("userName is not Valid");
  else if (req.body.phone > 9999999999 || req.body.phone < 6666666666)
    return res.status(401).send("phone is not Valid");
  else if (!emailValidator.validate(req.body.email))
    return res.status(401).send("Email is not Valid");
  else if (!schema.validate(req.body.password))
    return res
      .status(401)
      .send(schema.validate(req.body.password, { details: true }));
  else next();
};

const postValidation = (req, res, next) => {
  if (req.body.userId.length <= 10) {
    res.status(401).send("userId is Not Valid");
    res.end();
  } else next();
};

const passwordValidation = (req, res, next) => {
  if (schema.validate(req.body.password)) {
    next();
  } else {
    res.status(401).json(schema.validate(req.body.password, { details: true }));
    res.end();
  }
};

const isValidIds = (req, res, next) => {
  if (req.body.userId == req.body.friendId) {
    res.status(401).send("You Can't Send or Accept Your Request from self");
    res.end();
    return;
  }
  if (
    mongoose.Types.ObjectId.isValid(req.body.userId) &&
    mongoose.Types.ObjectId.isValid(req.body.friendId)
  ) {
    next();
  } else {
    res.status(401).send("User Or Friend Id is Not Valid");
    res.end();
    return;
  }
};

const isValidArrayIds = (req, res, next) => {
  req.body.ids = req.body.ids.filter((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );
  if (req.body.ids.length == 0) {
    res.status(404).send("not found");
    res.end();
    return;
  } else {
    next();
  }
};

const isValidIdsPost = (req, res, next) => {
  if (
    !mongoose.Types.ObjectId.isValid(req.body.userId) &&
    !mongoose.Types.ObjectId.isValid(req.body.postId)
  ) {
    return res.status(400).send("UserId or PostId Is Not Valid");
  } else if (req.body.userId == req.body.postId) {
    return res.status(400).send("UserId And PostId Are Same");
  } else {
    next();
  }
};

module.exports = {
  isValidIdsPost,
  isValidArrayIds,
  signupValidation,
  postValidation,
  passwordValidation,
  isValidIds,
};
