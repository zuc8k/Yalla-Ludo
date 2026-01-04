const createPlayer = require("./ludo.state");
const logic = require("./ludo.logic");

const games = {};

module.exports = (io, socket) => {

  socket.on("ludo_create", color => {
    const room = "LUDO_" + Date.now();
    games[room] = {
      players: [createPlayer(color)],
      turn: 0
    };

    socket.join(room);
    socket.emit("ludo_created", room);
  });

  socket.on("ludo_join", ({ room, color }) => {
    games[room].players.push(createPlayer(color));
    socket.join(room);

    io.to(room).emit("ludo_start", games[room]);
  });

  socket.on("ludo_move", ({ room, pieceIndex, dice }) => {
    const game = games[room];
    const player = game.players[game.turn];

    const piece = player.pieces[pieceIndex];
    if (!logic.canMove(piece, dice)) return;

    const newPos = logic.movePiece(piece, dice, player.color);
    const killed = logic.checkKill(
      game.players,
      player.color,
      newPos
    );

    if (logic.checkWin(player)) {
      io.to(room).emit("ludo_win", player.color);
      delete games[room];
      return;
    }

    game.turn = (game.turn + 1) % game.players.length;

    io.to(room).emit("ludo_update", {
      players: game.players,
      turn: game.turn,
      killed
    });
  });

};