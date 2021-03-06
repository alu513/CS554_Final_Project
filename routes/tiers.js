const express = require("express");
const router = express.Router();
const tiersData = require("../data/tiers");

router.get("/", async (req, res) => {
  try {
    const tiers = await tiersData.getAllTiers();
    res.json(tiers);
  } catch (e) {
    console.log(e);
    res.status(500).send("tier get failed");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tier = await tiersData.getTierListById(req.params.id);
    res.json(tier);
  } catch (e) {
    console.log(e);
    res.status(500).send("tier get failed");
  }
});

router.post("/", async (req, res) => {
  const json = req.body;
  var size = Object.keys(json).length;

  if (
    typeof json == "object" &&
    json.hasOwnProperty("creator") &&
    json.hasOwnProperty("tierList") &&
    json.hasOwnProperty("title") &&
    size == 3
  ) {
    try {
      let newTierList = await tiersData.createTierList(
        json.creator,
        json.tierList,
        json.title
      );
      return res.status(200).json(newTierList);
    } catch (e) {
      console.log(e);
      return res.status(500).send("tier post failed 500");
    }
  } else {
    return res.status(400).send("tier post failed 400");
  }
});

router.patch("/likes", async (req, res) => {
  const json = req.body;
  let newTierList;
  try {
    newTierList = await tiersData.changeUserLikes(json.userId, json.tierId);
  } catch (e) {
    console.log(e);
    return res.status(400).send("tier patch (likes) failed");
  }
  return res.status(200).json(newTierList);
});

router.patch("/edit", async (req, res) => {
  const json = req.body;
  let newTierList;
  try {
    newTierList = await tiersData.updateTierList(
      json.tierId,
      json.tierList,
      json.title
    );
  } catch (e) {
    console.log(e);
    return res.status(400).send("tier patch (tier list) failed");
  }
  return res.status(200).json(newTierList);
});

module.exports = router;
