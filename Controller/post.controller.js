const uploadFilesMiddleware = require("../middleware/fileUploads");
const db = require("./../Model/index");

const getPostById = async (req, res) => {
  try {
    let id = req.params.id;
    let post = await db.posts.findById(id);
    res.status(200).json(post);
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

const createPost = async (req, res) => {
  try {

    await uploadFilesMiddleware(req, res)
    let info = req.query
    info.photo = req.file.filename
    info.userId = req.userId
    // let postInfo = {
    //   caption: req.caption ? req.caption : "",
    //   userId: req.userId,
    //   comments: [],
    //   like: [],
    //   photo: req.file.filename
    // };

    let createdPost = await db.posts.create(info);
    let user = await db.user.findById(req.params.id);

    user.myPosts.push(createdPost.id)
    await user.save()

    return res.status(200).json({ msg: "Post created Successfully" });

  } catch (err) {
    res.status(200).json(err);
    res.end();
  }
};

const allPosts = async (req, res) => {

  let page = req.query.page
  let skip = (page - 1) * 5

  let posts = await db.posts.find({}).skip(skip).limit(5);
  posts.sort(() => Math.random() - 0.5)
  res.status(200).send(posts);
  res.end();
};

const getRelatedPosts = async (req, res) => {
  let relatedPosts = [];
  try {
    let page = req.query.page
    let skip = (page - 1) * 5
    let id = req.params.id;
    let friendsPosts = await db.user
      .findById(id, "myFriends myPosts").populate('myPosts')
      .populate("myFriends", "myPosts");
    friendsPosts.myFriends.map((e) => relatedPosts.push(...e.myPosts));
    let allPostsRel = await db.posts.find({ _id: { $in: relatedPosts } }).skip(skip).limit(5);
    res.status(200).json(allPostsRel.sort(() => Math.random() - 0.5));
    res.end();
  } catch (err) {
    res.status(200).json(err);
    res.end();
  }
};

const like = async (req, res) => {
  try {
    let { userId, postId } = req.body;
    let post = await db.posts.findById(postId);

    if (post.like.includes(userId)) {
      res.status(400).send("your Already like this post");
      res.end();
      return;
    }
    post.like.push(userId);
    await post.save();
    await db.user.findByIdAndUpdate(userId, {
      $push: { likedPosts: postId },
    });
    res.status(200).json(post.like.length);
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};
const dislike = async (req, res) => {
  try {
    let { userId, postId } = req.body;
    let post = await db.posts.findById(postId);
    let index = post.like.findIndex((index) => index == userId);
    if (index != -1) {
      post.like.splice(index, 1);
      await post.save();
      await db.user.findByIdAndUpdate(userId, {
        $pull: { likedPosts: postId },
      });
      res.status(201).send("post disLikeSuccessfully");
      res.end();
    } else {
      res.status(400).send("you not like this post");
      res.end();
    }
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

const comment = async (req, res) => {
  try {
    let { postId, comment } = req.body;
    if (comment.body.length == 0 || comment.name.length == 0) {
      res.status(404).send("comment is in valid");
      res.end();
    }
    await db.posts.findByIdAndUpdate(postId, {
      $push: { comments: comment },
    });
    res.status(200).json({ msg: "Success" });
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

const getPostByUserId = async (req, res) => {
  try {
    let id = req.params.id;
    let posts = await db.posts.find({ userId: id });
    res.status(200).json(posts);
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

module.exports = {
  getPostByUserId,
  getPostById,
  createPost,
  allPosts,
  getRelatedPosts,
  like,
  dislike,
  comment,
};
