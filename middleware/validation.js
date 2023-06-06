let db = require('./../Model/index')
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

const signupValidation = async (req, res, next) => {
  try {

    if (!req.body.firstName || req.body.firstName.length <= 1)
      return res.status(200).send("firstName is not Valid");
    else if (!req.body.lastName || req.body.lastName.length <= 1)
      return res.status(200).send("lastName is not Valid");
    else if (!req.body.phone || req.body.phone > 9999999999 || req.body.phone < 6666666666)
      return res.status(200).send("phone Number is not Valid");
    else if (!req.body.email || req.body.email.length<=5 || !req.body.email.includes('@') || !req.body.email.includes('.'))
      return res.status(200).send("email is not Valid");


    else if (!schema.validate(req.body.password))
      return res
        .status(201)
        .send(schema.validate(req.body.password, { details: true })[0].message);


    let isEmail = await db.user.findOne({ email: req.body.email })
    if (isEmail) {
      return res.status(200).send('Change Email Address')
    }
    let isPhone = await db.user.findOne({ phone: req.body.phone })
    if (isPhone) {
      return res.status(200).send('Change Phone Number')
    }
    next()
  } catch (err) {
    return res.status(200).send(err)
  }
}

const postValidation = (req, res, next) => {
  if (req.body.userId.length <= 10) {
    res.status(401).send("userId is Not Valid");
    res.end();
  } else next();
};

const passwordValidation = (req, res, next) => {
  if (!req.body.detail || req.body.detail.length == 0) return res.status(200).send('Enter Detail')
  if (schema.validate(req.body.password)) {
    next();
  } else {
   return  res.status(200).json('password incorrect');
 
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

const identifyInput = (req, res, next) => {
  if (req.body.detail) {
    if (typeof req.body.detail=='string' && req.body.detail.includes("@") && req.body.detail.includes('.com')) {
      req.body.type = 'email'
      next()
    } else if (!isNaN(Number(req.body.detail))) {
      req.body.type = "phone"
      next()
    } 
    return res.status(200).send("Enter Email or Phone")
  } else {
    return res.status(200).send("Enter Email or Phone")
  }
}


module.exports = {
  identifyInput,
  isValidIdsPost,
  isValidArrayIds,
  signupValidation,
  postValidation,
  passwordValidation,
  isValidIds,
};
