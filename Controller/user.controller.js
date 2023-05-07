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
    let users = await db.user.find({}, "name userName");
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
  let { userId, friendId } = req.body;
  try {
    let user = await db.user.findById(
      userId,
      "friendReq myFriends sendFriendReq"
    );
    if (user.friendReq.includes(friendId)) {
      await db.user.findByIdAndUpdate(userId, {
        $pull: { friendReq: friendId },
      });
      await db.user.findByIdAndUpdate(friendId, {
        $pull: { sendFriendReq: userId },
      });
      await db.user.findByIdAndUpdate(userId, {
        $push: { myFriends: friendId },
      });
      await db.user.findByIdAndUpdate(friendId, {
        $push: { myFriends: userId },
      });
      res.status(200).json({ msg: "Friend Request Accepted" });
      res.end();
    } else if (user.myFriends.includes(friendId)) {
      res.status(401).send("Already Friend");
      res.end();
    } else if (user.sendFriendReq.includes(friendId)) {
      res
        .status(400)
        .send("Your not able accept req because you send request this friend");
      res.end();
    } else {
      res.status(404).send("You and Not request from this friend ");
      res.end();
      return;
    }
  } catch (err) {
    res.status(400).json(err);
    res.end();
  }
};

const sendFriendRequests = async (req, res) => {
  try {
    let { userId, friendId } = req.body;
    if (userId === friendId) {
      res.status(404).send("You not Sent You Friend Request");
      res.end();
      return;
    }

    let isMyFriend = await db.user.findById(
      userId,
      "myFriends friendReq sendFriendReq"
    );

    if (isMyFriend.myFriends.includes(friendId)) {
      res.status(404).send("You are Already Friend");
      res.end();
    } else if (isMyFriend.sendFriendReq.includes(friendId)) {
      res.status(404).send("You Already send Friend Request");
      res.end();
    } else if (isMyFriend.friendReq.includes(friendId)) {
      res.status(404).send("You Have Already Friend Request From This Friend");
      res.end();
    } else {
      await db.user.findByIdAndUpdate(userId, {
        $push: { sendFriendReq: friendId },
      });
      await db.user.findByIdAndUpdate(friendId, {
        $push: { friendReq: userId },
      });
      res.status(200).json({ msg: "Request Send Successfully" });
      res.end();
    }
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

const findAllUserByIds = async (req, res) => {
  try {
    let array = req.body.ids;
    let allUser = await db.user.find({ _id: { $in: array } }, "name userName");
    res.status(200).json(allUser);
    res.end();
  } catch (err) {
    res.status(404).json(err);
    res.end();
  }
};




module.exports = {
  findAllUserByIds,
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
