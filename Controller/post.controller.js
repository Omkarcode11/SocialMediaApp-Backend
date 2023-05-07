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
    let postInfo = req.body;
    let createdPost = await db.posts.create(postInfo);
    await db.user.findOneAndUpdate(
      { _id: postInfo.userId },
      { $push: { myPosts: createdPost.id } }
    );
    res.status(200).json(createdPost);
    res.end();
  } catch (err) {
    res.status(202).json(err);
    res.end();
  }
};

const allPosts = async (req, res) => {
  let posts = await db.posts.find({});
  res.status(200).json(posts);
  res.end();
};

const getRelatedPosts = async (req, res) => {
  let relatedPosts = [];
  try {
    let id = req.params.id;
    let friendsPosts = await db.user
      .findById(id, "myFriends")
      .populate("myFriends", "myPosts");
    friendsPosts.myFriends.map((e) => relatedPosts.push(...e.myPosts));
    let allPostsRel = await db.posts.find({ _id: { $in: relatedPosts } });
    res.status(200).json(allPostsRel);
    res.end();
  } catch (err) {
    res.status(200).json(err);
    res.end();
  }
};

const like = async (req, res) => {
  try {
    let { userId, postId } = req.body;
    let post = await db.posts.findByIdAndUpdate(postId, {
      $push: { like: userId },
    });
    let user = await db.user.findByIdAndUpdate(userId, {
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
    let post = await db.posts.findByIdAndUpdate(postId, {
      $pull: { like: userId },
    });
    let user = await db.user.findByIdAndUpdate(userId, {
      $pull: { likedPosts: postId },
    });

    res.status(200).send(post.like.length);
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

const comment = async (req, res) => {
  try {
    let { postId, comment } = req.body;
    let comm = await db.posts.findByIdAndUpdate(postId, {
      $push: { comments: comment },
    });
    res.status(200).json({ 'msg': "Success" });
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

module.exports = {
  getPostById,
  createPost,
  allPosts,
  getRelatedPosts,
  like,
  dislike,
  comment,
};
