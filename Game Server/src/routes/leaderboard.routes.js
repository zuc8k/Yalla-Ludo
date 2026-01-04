const router = require("express").Router();
const User = require("../models/User");

// 🌍 Global Leaderboard
router.get("/global", async (req, res) => {
  const top = await User.find()
    .sort({ rankPoints: -1 })
    .limit(50)
    .select("username rank rankPoints");

  res.json(top);
});

// 🗓 Weekly Leaderboard (MVP)
router.get("/weekly", async (req, res) => {
  const top = await User.find()
    .sort({ wins: -1 })
    .limit(50)
    .select("username wins");

  res.json(top);
});

module.exports = router;