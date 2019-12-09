const mongoCollections = require("../config/mongoCollections");
const tiers = mongoCollections.tiers;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

async function createTierList(creator, tierList) {
  if (!creator) {
    throw "error: argument creator does not exist";
  }
  if (!tierList) {
    throw "error: argument tierList does not exist";
  }
  if (typeof creator !== "string") {
    throw "error: argument creator is not type string";
  }
  if (!Array.isArray(tierList)) {
    throw "error: argument tierList is not type array";
  }

  const tierCollection = await tiers();

  let newTierList = {
    creator: creator,
    tierList: tierList,
    userLikes: []
  };

  const insertInfo = await tierCollection.insertOne(newTierList);
  if (insertInfo.insertedCount === 0) throw "Could not add a tier";

  return await tierCollection.findOne({
    _id: ObjectId(insertInfo.insertedId)
  });
}

async function getAllTiers() {
  const tierCollection = await tiers();

  const tierArray = await tierCollection.find({}).toArray();

  return tierArray;
}

async function getTierListById(id) {
  if (!id) {
    throw "error: argument id does not exist";
  }
  const tierCollection = await tiers();
  const parsedId = ObjectId(id);

  const tier = await tierCollection.findOne({ _id: parsedId });
  if (tier === null) throw "No tier list with that id";

  return tier;
}

async function getUserLikesById(id) {
  if (!id) {
    throw "error: argument id does not exist";
  }
  const tierCollection = await tiers();
  const parsedId = ObjectId(id);

  const tier = await tierCollection.findOne({ _id: parsedId });
  if (tier === null) throw "No tier list with that id";

  return tier.userLikes;
}

async function changeUserLikes(userId, tierListId) {
  if (!tierListId) {
    throw "error: argument tierListId does not exist";
  }
  if (!userId) {
    throw "error: argument userId does not exist";
  }

  const tierCollection = await tiers();
  const userCollection = await users();
  const parsedTierId = ObjectId(tierListId);
  const parsedUserId = ObjectId(tierListId);

  let tier = await tierCollection.findOne({ _id: parsedTierId });
  let user = await userCollection.findOne({ _id: parsedUserId });

  if (tier.userLikes.includes(userId) === null) {
    const updateTierLikes = await tierCollection.updateOne(
      { _id: tier._id },
      { $push: { userLikes: parsedUserId } }
    );

    const updateUserLikes = await userCollection.updateOne(
      { _id: user._id },
      { $push: { userLikes: parsedTierId } }
    );

    if (updateTierLikes.modifiedCount === 0) {
      throw "could not like (Tiers) successfully";
    }

    if (updateUserLikes.modifiedCount === 0) {
      throw "could not like (Users) successfully";
    }
  } else {
    const updateTierLikes = await tierCollection.updateOne(
      { _id: tier._id },
      { $pull: { userLikes: parsedUserId } }
    );

    const updateUserLikes = await userCollection.updateOne(
      { _id: user._id },
      { $pull: { userLikes: parsedTierId } }
    );

    if (updateTierLikes.modifiedCount === 0) {
      throw "could not unlike (Tiers) successfully";
    }

    if (updateUserLikes.modifiedCount === 0) {
      throw "could not unlike (Users) successfully";
    }
  }

  return this.getTierListById(tierListId);
}

async function updateTierList(tierListId, newTierList) {
  if (!tierListId) {
    throw "error: argument tierListId does not exist";
  }
  if (!newTierList) {
    throw "error: argument newTierList does not exist";
  }

  const tierCollection = await tiers();
  const parsedTierId = ObjectId(tierListId);
  let tier = await tierCollection.findOne({ _id: parsedTierId });

  const updateTierLikes = await tierCollection.updateOne(
    { _id: tier._id },
    { $set: { tierList: newTierList } }
  );

  if (updateTierLikes.modifiedCount === 0) {
    throw "could not like (Tiers) successfully";
  }

  return this.getTierListById(tierListId);
}

module.exports = {
  createTierList,
  getAllTiers,
  getTierListById,
  getUserLikesById,
  changeUserLikes,
  updateTierList
};