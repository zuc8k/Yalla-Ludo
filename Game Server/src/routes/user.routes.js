const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  res.json(user);
});

module.exports = router;