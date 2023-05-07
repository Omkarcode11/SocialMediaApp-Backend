const express = require("express");
const userRouter = express.Router();
const userController = require("./../Controller/user.controller");
const jwt = require("./../middleware/verifyJwtToken");
const validator = require("./../middleware/validation");

userRouter.get("/id/:id", userController.findById);
userRouter.get("/name/:name", userController.findByName);
userRouter.get("/delete/:name", userController.deleteByName);
userRouter.get("/delete/id/:id", userController.deleteById);
userRouter.get("/detail/:id", userController.userAllDetail);
userRouter.get("/allUsers", userController.allUsers);
userRouter.get("/myFriends/:id", [jwt.verify], userController.userAllFriend);
userRouter.get(
  "/friendRequests/:id",
  [jwt.verify],
  userController.getAllFriendRequests
);

userRouter.post(
  "/findAllIds",
  [jwt.verify, validator.isValidArrayIds],
  userController.findAllUserByIds
);

userRouter.put(
  "/acceptRequest",
  [jwt.verify, validator.isValidIds],
  userController.AcceptRequest
);

userRouter.patch("/update/:id", [jwt.verify], userController.updateById);

userRouter.patch(
  "/sendFriendRequest",
  [jwt.verify, validator.isValidIds],
  userController.sendFriendRequests
);

module.exports = userRouter;
