const express = require("express");
const router = express.Router();
const usersData = require("../data/users");

router.get("/", async (req, res) => {
  try {
    const json = req.body;
    const user = await usersData.getUserLikesById(json.userId);
    res.json(user);
  } catch (e) {
    console.log(e);
    res.sendStatus(500).send("user get failed");
  }
});

router.post("/", async (req, res) => {
  const json = req.body;
  var size = Object.keys(json).length;

  if (typeof json == "object" && json.hasOwnProperty("username") && size == 1) {
    try {
      let newUser = await usersData.createUser(json.username);
      return res.status(200).json(newUser);
    } catch (e) {
      console.log(e);
      return res.status(500).send("user post failed 500");
    }
  } else {
    return res.status(400).send("user post failed 400");
  }
});
