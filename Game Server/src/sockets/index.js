const matchmaking = require("../matchmaking/matchmaking");

module.exports = (io) => {
  io.on("connection", socket => {
    console.log("🎮 Player Connected:", socket.id);

    socket.on("find_match", () => {
      matchmaking.joinQueue(io, socket);
    });

    socket.on("cancel_match", () => {
      matchmaking.leaveQueue(socket);
    });

    socket.on("disconnect", () => {
      matchmaking.leaveQueue(socket);
      console.log("❌ Player Disconnected:", socket.id);
    });
  });
};