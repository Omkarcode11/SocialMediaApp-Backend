const { TopologyDescriptionChangedEvent } = require("mongodb");
const db = require("./../Model/index");

const findById = async (req, res) => {
  let id = req.params.id;
  try {
    const user = await db.user.findById(id);
    if (user) res.status(200).json(user);
    else res.status(404).json("User Not Found");
    res.end();
  } catch (err) {
    console.log(err);
    res.status(202).send("user Not found");
    res.end();
  }
};

const findByName = async (req, res) => {
  let name = req.params.name;
  try {
    const user = await db.user.findOne({ name });
    if (user) res.status(200).json(user);
    else res.status(404).json("User Not Found");
    res.end();
  } catch (err) {
    console.log(err);
    res.status(404).json("User Not Found");
    res.end();
  }
};

const deleteByName = async (req, res) => {
  let name = req.params.name;
  try {
    let user = await db.user.findOneAndDelete({ name });
    if (user) res.status(200).send("user Deleted Successfully");
    else res.status(404).send("User Not Found");

    res.end();
  } catch (err) {
    console.log(err);
    res.status(404).send("User Not Found");
    res.end();
  }
};
const deleteById = async (req, res) => {
  let id = req.params.id;
  try {
    let user = await db.user.findByIdAndDelete(id);
    if (user) res.status(200).send("user Deleted Successfully");
    else res.status(404).send("User Not Found");

    res.end();
  } catch (err) {
    console.log(err);
    res.status(404).json("User Not Found");
    res.end();
  }
};

const updateById = async (req, res) => {
  let id = req.params.id;
  let newData = req.body;
  if (req.body.password == "" || req.body.password) {
    res.status(300).send("this feature will  coming soon");
    res.end();
  }
  try {
    let user = await db.user.findByIdAndUpdate(id, newData);
    if (user) res.status(200).send("user Update Successfully");
    else res.status(404).send("User Not Found");
    res.end();
  } catch (err) {
    console.log(err);
    res.status(404).send("User Not Found");
    res.end();
  }
};

const userAllDetail = async (req, res) => {
  try {
    let id = req.params.id;
    let userDetail = await db.user
      .findById(id)
      .populate("myPosts")
      .populate("myFriends", "name userName")
      .populate("friendReq", "name userName")
      .populate("sendFriendReq", "name userName");
    res.status(200).json(userDetail);
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

const allUsers = async (req, res) => {
  try {
    let users = await db.user.find({},'name userName');
    res.status(200).json(users);
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

const userAllFriend = async (req, res) => {
  try {
    let id = req.params.id;
    let friends = await db.user
      .findById(id, "myFriends")
      .populate("myFriends", "name userName");
    res.status(200).json(friends);
    res.end();
  } catch (err) {
    res.status(400).json(err);
    res.end();
  }
};
const AcceptRequest = async (req, res) => {
  let { myId, friendId } = req.body;
  try {
    await db.user.findByIdAndUpdate(myId, {
      $pull: { friendReq: friendId },
    });
    await db.user.findByIdAndUpdate(friendId, {
      $pull: { sendFriendReq: myId },
    });
    await db.user.findByIdAndUpdate(myId, {
      $push: { myFriends: friendId },
    });
    await db.user.findByIdAndUpdate(friendId, {
      $push: { myFriends: myId },
    });
    res.status(200).json({ msg: "Friend Request Accepted" });
    res.end();
  } catch (err) {
    res.status(400).json(err);
    res.end();
  }
};

const sendFriendRequests = async (req, res) => {
  try {
    let { myId, friendId } = req.body;
    await db.user.findByIdAndUpdate(myId, {
      $push: { sendFriendReq: friendId },
    });
    await db.user.findByIdAndUpdate(friendId, { $push: { friendReq: myId } });
    res.status(200).json({ msg: "Request Send Successfully" });
    res.end();
  } catch (err) {
    res.status(400).json(err);
    res.end();
  }
};

const getAllFriendRequests = async (req, res) => {
  try {
    let id = req.params.id;
    let pendingRequests = await db.user
      .findById(id, "friendReq")
      .populate("friendReq", "name");
    res.status(200).json(pendingRequests);
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};

module.exports = {
  findById,
  findByName,
  deleteByName,
  deleteById,
  updateById,
  userAllDetail,
  allUsers,
  sendFriendRequests,
  userAllFriend,
  getAllFriendRequests,
  AcceptRequest,
};
