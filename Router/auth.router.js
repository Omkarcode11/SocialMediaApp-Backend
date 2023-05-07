const express = require("express");
const authRouter = express.Router();
const authController = require("./../Controller/auth.controller");
const validator = require("./../middleware/validation");

authRouter.post("/signup", [validator.signupValidation], authController.signup);
authRouter.post(
  "/signin",
  [validator.passwordValidation],
  authController.signin
);

module.exports = authRouter;
