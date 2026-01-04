const matchmaking = require("../matchmaking/matchmaking");
const redis = require("../config/redis");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("🎮 Player Connected:", socket.id);

    /* ================== ONLINE COUNT ================== */
    try {
      await redis.incr("online:count");
    } catch (err) {
      console.error("Redis online incr error", err);
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
        const count = await redis.decr("online:count");

if (count < 0) {
  await redis.set("online:count", 0);
}
      } catch (err) {
        console.error("Redis online decr error", err);
      }

      console.log("❌ Player Disconnected:", socket.id);
    });
  });
};