const express = require("express");
const postsRouter = express.Router();
const postController = require("./../Controller/post.controller");
const jwtMiddleWare = require("./../middleware/verifyJwtToken");
const validator = require("./../middleware/validation");
const { uploadFiles, getListFiles, download } = require('./../Controller/uploads');
const uploadFilesMiddleware = require("../middleware/fileUploads");

postsRouter.get("/get/:id", postController.getPostById);
postsRouter.get("/get/user/:id", postController.getPostByUserId);
postsRouter.post(
  "/create/:id",
  jwtMiddleWare.verify,
  postController.createPost
);
postsRouter.get("/WholePosts", postController.allPosts);
postsRouter.get(
  "/get/related/post/:id",
  [jwtMiddleWare.verify],
  postController.getRelatedPosts
);
postsRouter.put("/like", [validator.isValidIdsPost], postController.like);
postsRouter.put("/dislike", [validator.isValidIdsPost], postController.dislike);
postsRouter.put("/comment", [jwtMiddleWare.verify], postController.comment);


postsRouter.post('/upload', uploadFiles)
postsRouter.get('/files', getListFiles)
postsRouter.get('/files/:name', download)

module.exports = postsRouter;
