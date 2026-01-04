const { v4: uuid } = require("uuid");

const QUEUE = [];
const ROOMS = {};

const MAX_PLAYERS = 4;

exports.joinQueue = (io, socket) => {
  if (QUEUE.includes(socket.id)) return;

  QUEUE.push(socket.id);
  socket.emit("queue_joined", QUEUE.length);

  // لما العدد يكمل
  if (QUEUE.length >= MAX_PLAYERS) {
    const roomId = "ROOM_" + uuid().slice(0, 6);

    ROOMS[roomId] = {
      players: [],
      turn: 0
    };

    for (let i = 0; i < MAX_PLAYERS; i++) {
      const playerId = QUEUE.shift();
      ROOMS[roomId].players.push(playerId);

      const playerSocket = io.sockets.sockets.get(playerId);
      if (playerSocket) {
        playerSocket.join(roomId);
        playerSocket.emit("match_found", {
          roomId,
          players: ROOMS[roomId].players
        });
      }
    }

    console.log("🎯 Match Created:", roomId);
  }
};

exports.leaveQueue = (socket) => {
  const index = QUEUE.indexOf(socket.id);
  if (index !== -1) QUEUE.splice(index, 1);
};