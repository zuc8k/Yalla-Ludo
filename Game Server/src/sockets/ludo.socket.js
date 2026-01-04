const redis = require("../config/redis");

module.exports = (io, socket) => {

  /* ================== JOIN ROOM ================== */
  socket.on("join_room", async (roomId) => {
    socket.join(roomId);

    io.to(roomId).emit("player_joined", socket.id);

    // 🟢 لو أول مرة يدخل الروم نزود العدّاد
    try {
      const size = io.sockets.adapter.rooms.get(roomId)?.size;
      if (size === 1) {
        await redis.incr("rooms:count");
      }
    } catch (e) {
      console.error("Redis rooms incr error", e);
    }
  });

  /* ================== ROLL DICE ================== */
  socket.on("roll_dice", (roomId) => {
    const dice = Math.floor(Math.random() * 6) + 1;

    io.to(roomId).emit("dice_result", {
      player: socket.id,
      value: dice
    });
  });

  /* ================== DISCONNECT ================== */
  socket.on("disconnect", async () => {
    try {
      // نقص عدد اللاعبين الأونلاين
      await redis.decr("online:count");

      // نشوف كل الرومات اللي كان فيها
      const rooms = [...socket.rooms].filter(r => r !== socket.id);

      for (const roomId of rooms) {
        const size = io.sockets.adapter.rooms.get(roomId)?.size || 0;

        // لو الروم فضيت بعد خروجه
        if (size <= 1) {
          await redis.decr("rooms:count");
        }
      }
    } catch (e) {
      console.error("Redis disconnect error", e);
    }
  });

};