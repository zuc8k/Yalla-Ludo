const rooms = {}; // memory rooms (MVP)

module.exports = (io, socket) => {

  // إنشاء غرفة
  socket.on("create_room", () => {
    const roomId = "ROOM_" + Math.floor(Math.random() * 9999);
    rooms[roomId] = {
      players: [socket.id],
      turn: 0
    };

    socket.join(roomId);
    socket.emit("room_created", roomId);
  });

  // دخول غرفة
  socket.on("join_room", roomId => {
    if (!rooms[roomId]) return;

    rooms[roomId].players.push(socket.id);
    socket.join(roomId);

    io.to(roomId).emit("player_joined", rooms[roomId].players);
  });

  // رمي النرد
  socket.on("roll_dice", roomId => {
    const room = rooms[roomId];
    if (!room) return;

    const currentPlayer = room.players[room.turn];
    if (socket.id !== currentPlayer) return;

    const dice = Math.floor(Math.random() * 6) + 1;
    io.to(roomId).emit("dice_result", {
      player: socket.id,
      value: dice
    });

    room.turn = (room.turn + 1) % room.players.length;
    io.to(roomId).emit("next_turn", room.turn);
  });

};