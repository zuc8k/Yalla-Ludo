const router = require("express").Router();
const User = require("../models/User");
const Payment = require("../models/Payment");
const CheatLog = require("../models/CheatLog");
const HWIDBan = require("../models/HWIDBan");

// 👤 كل المستخدمين
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// 💰 كل الشحنات
router.get("/payments", async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  res.json(payments);
});

// 🚨 سجلات الغش
router.get("/cheats", async (req, res) => {
  const cheats = await CheatLog.find().sort({ createdAt: -1 });
  res.json(cheats);
});

// 🚫 HWID BAN
router.post("/ban-hwid", async (req, res) => {
  const { hwid, reason } = req.body;

  if (!hwid)
    return res.status(400).json({ msg: "HWID required" });

  await HWIDBan.create({
    hwid,
    reason: reason || "No reason"
  });

  res.json({ success: true });
});

module.exports = router;