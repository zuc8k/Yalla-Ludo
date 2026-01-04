module.exports = (io) => {
  io.on("connection", socket => {
    console.log("🎮 Player Connected:", socket.id);

    require("./game.socket")(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ Player Disconnected:", socket.id);
    });
  });
};