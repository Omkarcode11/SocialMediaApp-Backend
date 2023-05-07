const express = require("express");
const userRouter = express.Router();
const userController = require("./../Controller/user.controller");
const jwt = require("./../middleware/verifyJwtToken");

userRouter.get("/id/:id", userController.findById);
userRouter.get("/name/:name", userController.findByName);
userRouter.get("/delete/:name", userController.deleteByName);
userRouter.get("/delete/id/:id", userController.deleteById);
userRouter.get("/detail/:id", userController.userAllDetail);
userRouter.get("/allUsers", userController.allUsers);
userRouter.get("/myFriends/:id", [jwt.verify], userController.userAllFriend);
userRouter.get("/friendRequests/:id",[jwt.verify],userController.getAllFriendRequests);
userRouter.put("/acceptRequest", [jwt.verify], userController.AcceptRequest);
userRouter.patch("/update/:id", [jwt.verify], userController.updateById);
userRouter.patch("/sendFriendRequest",[jwt.verify],userController.sendFriendRequests);

module.exports = userRouter;
