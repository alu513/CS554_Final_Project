const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

async function createUser(username, uid) {
  if (!username) {
    throw "error: argument username does not exist";
  }
  if (typeof username !== "string") {
    throw "error: argument username is not type string";
  }
  if (!uid) {
    throw "error: argument uid does not exist";
  }
  if (typeof uid !== "string") {
    throw "error: argument uid is not type string";
  }

  const userCollection = await users();

  let newUser = {
    username: username,
    uid: uid,
    userTiers: [],
    likedTiers: []
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add a user";

  return await userCollection.findOne({
    _id: ObjectId(insertInfo.insertedId)
  });
}

async function getAllUsers() {
  const userCollection = await users();

  const userArray = await userCollection.find({}).toArray();

  return userArray;
}

async function getUserById(id) {
  if (!id) throw "You must provide an id to search for";

  const userCollection = await users();
  const parsedId = ObjectId(id);

  const user = await userCollection.findOne({ _id: parsedId });
  if (user === null) throw "No user with that id";

  return user;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById
};
