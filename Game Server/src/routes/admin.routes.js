const router = require("express").Router();
const CheatLog = require("../models/CheatLog");
const GameLog = require("../models/GameLog");

router.get("/cheats", async (req, res) => {
  const logs = await CheatLog.find().sort({ createdAt: -1 });
  res.json(logs);
});

router.get("/games", async (req, res) => {
  const games = await GameLog.find().sort({ endedAt: -1 });
  res.json(games);
});

module.exports = router;