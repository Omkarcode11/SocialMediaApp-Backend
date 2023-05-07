const express = require("express");
const postsRouter = express.Router();
const postController = require("./../Controller/post.controller");
const jwtMiddleWare = require("./../middleware/verifyJwtToken");
const validator = require('./../middleware/validation')

postsRouter.get("/get/:id", postController.getPostById);
postsRouter.post("/create", [jwtMiddleWare.verify,validator.postValidation], postController.createPost);
postsRouter.get("/WholePosts", postController.allPosts);
postsRouter.get(
  "/get/related/post/:id",
  [jwtMiddleWare.verify],
  postController.getRelatedPosts
);
postsRouter.put("/like", [jwtMiddleWare.verify], postController.like);
postsRouter.put("/dislike", [jwtMiddleWare.verify], postController.dislike);
postsRouter.put("/comment", [jwtMiddleWare.verify], postController.comment);

module.exports = postsRouter;
