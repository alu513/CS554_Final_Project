const mongoCollections = require("../config/mongoCollections");
const tiers = mongoCollections.tiers;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

async function createTierList(creator, tierList, title) {
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

  let d = new Date();

  let newTierList = {
    creator: creator,
    tierList: tierList,
    title: title,
    ts: d,
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

async function changeUserLikes(uid, tierListId) {
  if (!tierListId) {
    throw "error: argument tierListId does not exist";
  }

  const tierCollection = await tiers();
  const parsedTierId = ObjectId(tierListId);

  let tier = await tierCollection.findOne({ _id: parsedTierId });

  if (tier.userLikes.includes(uid) === null) {
    const updateTierLikes = await tierCollection.updateOne(
      { _id: tier._id },
      { $push: { userLikes: uid } }
    );

    if (updateTierLikes.modifiedCount === 0) {
      throw "could not like (Tiers) successfully";
    }
  } else {
    const updateTierLikes = await tierCollection.updateOne(
      { _id: tier._id },
      { $pull: { userLikes: uid } }
    );

    if (updateTierLikes.modifiedCount === 0) {
      throw "could not unlike (Tiers) successfully";
    }
  }

  return this.getTierListById(tierListId);
}

async function updateTierList(tierListId, newTierList, newTitle) {
  if (!tierListId) {
    throw "error: argument tierListId does not exist";
  }
  if (!newTierList) {
    throw "error: argument newTierList does not exist";
  }
  if (!newTitle) {
    throw "error: argument newTierList does not exist";
  }

  const tierCollection = await tiers();
  const parsedTierId = ObjectId(tierListId);
  let tier = await tierCollection.findOne({ _id: parsedTierId });

  const updateTierLikes = await tierCollection.updateOne(
    { _id: tier._id },
    { $set: { tierList: newTierList, title: newTitle } }
  );

  if (updateTierLikes.modifiedCount === 0) {
    throw "could not update (Tiers) successfully";
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
