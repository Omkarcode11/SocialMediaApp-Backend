const express = require("express");
const authRouter = express.Router();
const authController = require("./../Controller/auth.controller");
const jwtMiddleWare = require('./../middleware/verifyJwtToken')

authRouter.post("/signup", authController.signup);
authRouter.post("/signin",authController.signin);

module.exports = authRouter;
