const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: String,
  username: String,
  password: String,

  coins: { type: Number, default: 1000 },
  gems: { type: Number, default: 10 },

  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },

  wins: { type: Number, default: 0 },
  loses: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);