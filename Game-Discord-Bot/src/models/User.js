const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: String,
  username: String,
  coins: Number,
  rank: String,
  rankPoints: Number,
  wins: Number,
  loses: Number,
  banned: Boolean,
  hwid: String
});

module.exports = mongoose.model("User", UserSchema);