const matchmaking = require("../matchmaking/matchmaking");
const redis = require("../config/redis");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("🎮 Player Connected:", socket.id);

    /* ================== ONLINE SET ================== */
    try {
      // أضف Socket ID للـ Set
      await redis.sAdd("online:sockets", socket.id);
    } catch (err) {
      console.error("Redis sAdd error", err);
    }

    /* ================== MATCHMAKING ================== */
    socket.on("find_match", async () => {
      matchmaking.joinQueue(io, socket);
    });

    socket.on("cancel_match", async () => {
      matchmaking.leaveQueue(socket);
    });

    /* ================== DISCONNECT ================== */
    socket.on("disconnect", async () => {
      matchmaking.leaveQueue(socket);

      try {
        // احذف Socket ID من الـ Set
        await redis.sRem("online:sockets", socket.id);
      } catch (err) {
        console.error("Redis sRem error", err);
      }

      console.log("❌ Player Disconnected:", socket.id);
    });
  });
};