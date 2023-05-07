let emailValidator = require("email-validator");
let passWordValidator = require("password-validator");

let schema = new passWordValidator();

schema.is().min(5).max(100).uppercase().lowercase().digits(2).not().spaces();

const signupValidation = (req, res, next) => {
  req.body.name = req.body.name.trim();
  req.body.userName = req.body.userName.trim();
  if (req.body.name.length <= 1) {
    res.status(401).send("name is not Valid");
  } else if (req.body.userName.length <= 1) {
    res.status(401).send("userName is not Valid");
  } else if (req.body.phone <= 6000000000 && req.body.phone > 9999999999) {
    res.status(401).send("phone is not Valid");
  } else if (!emailValidator.validate(req.body.email)) {
    res.status(401).send("Email is not Valid");
  } else if (!schema(req.body.password)) {
    res.status(401).send("password is not Valid");
  } else {
    next();
  }
  res.end();
};

const postValidation = (req, res, next) => {
  if (req.body.userId.length <= 10) {
    res.status(401).send("userId is Not Valid");
  } else {
    next();
  }
  res.end();
};

module.exports = { signupValidation, postValidation };
