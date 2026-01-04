module.exports = (io) => {
  io.on("connection", socket => {
    console.log("🎮 Player Connected:", socket.id);
    require("./ludo.socket")(io, socket);
  });
};