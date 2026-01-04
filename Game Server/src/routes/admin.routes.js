const router = require("express").Router();
const User = require("../models/User");
const Payment = require("../models/Payment");
const CheatLog = require("../models/CheatLog");

// 👤 كل المستخدمين
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💰 كل عمليات الشحن
router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚨 سجلات الغش
router.get("/cheats", async (req, res) => {
  try {
    const cheats = await CheatLog.find().sort({ createdAt: -1 });
    res.json(cheats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;