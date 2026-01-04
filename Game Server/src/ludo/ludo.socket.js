const createPlayer = require("./ludo.state");
const logic = require("./ludo.logic");
const antiCheat = require("../antiCheat/validator");

const User = require("../models/User");
const rankLogic = require("../rank/rank.logic");

const games = {};

module.exports = (io, socket) => {

  // إنشاء لعبة
  socket.on("ludo_create", ({ color, userId }) => {
    const room = "LUDO_" + Date.now();

    games[room] = {
      players: [
        {
          userId,
          socketId: socket.id,
          ...createPlayer(color)
        }
      ],
      turn: 0,
      startedAt: new Date(),
      moves: 0
    };

    socket.join(room);
    socket.emit("ludo_created", room);
  });

  // دخول لعبة
  socket.on("ludo_join", ({ room, color, userId }) => {
    if (!games[room]) return;

    games[room].players.push({
      userId,
      socketId: socket.id,
      ...createPlayer(color)
    });

    socket.join(room);

    io.to(room).emit("ludo_start", {
      players: games[room].players.map(p => ({
        userId: p.userId,
        color: p.color,
        pieces: p.pieces
      })),
      turn: games[room].turn
    });
  });

  // حركة اللعب
  socket.on("ludo_move", async ({ room, pieceIndex, dice, userId }) => {
    const game = games[room];
    if (!game) return;

    const player = game.players[game.turn];

    /* ================== Anti Cheat ================== */

    if (player.userId !== userId) {
      await antiCheat.invalidMove({
        userId,
        action: "MOVE",
        reason: "Play out of turn",
        roomId: room
      });
      return;
    }

    if (dice < 1 || dice > 6) {
      await antiCheat.invalidMove({
        userId,
        action: "DICE",
        reason: "Invalid dice value",
        roomId: room
      });
      return;
    }

    const piece = player.pieces[pieceIndex];

    if (!logic.canMove(piece, dice)) {
      await antiCheat.invalidMove({
        userId,
        action: "MOVE",
        reason: "Illegal piece move",
        roomId: room
      });
      return;
    }

    /* ================== Game Logic ================== */

    const newPos = logic.movePiece(piece, dice, player.color);

    const killed = logic.checkKill(
      game.players,
      player.color,
      newPos
    );

    game.moves++;

    /* ================== WIN ================== */

    if (logic.checkWin(player)) {

      // 🏆 تحديث الرانك للفائز
      const winner = await User.findById(player.userId);
      winner.rankPoints += rankLogic.calculatePoints(true);
      winner.rank = rankLogic.getRank(winner.rankPoints);
      winner.wins += 1;
      await winner.save();

      // ❌ تحديث الخاسرين
      for (const p of game.players) {
        if (p.userId !== player.userId) {
          const loser = await User.findById(p.userId);
          loser.rankPoints += rankLogic.calculatePoints(false);
          if (loser.rankPoints < 0) loser.rankPoints = 0;
          loser.rank = rankLogic.getRank(loser.rankPoints);
          loser.loses += 1;
          await loser.save();
        }
      }

      io.to(room).emit("ludo_win", {
        winner: player.userId,
        color: player.color,
        rank: winner.rank,
        rankPoints: winner.rankPoints
      });

      delete games[room];
      return;
    }

    // الدور اللي بعده
    game.turn = (game.turn + 1) % game.players.length;

    io.to(room).emit("ludo_update", {
      players: game.players.map(p => ({
        userId: p.userId,
        color: p.color,
        pieces: p.pieces
      })),
      turn: game.turn,
      killed
    });
  });

  // خروج لاعب
  socket.on("disconnect", () => {
    for (const room in games) {
      games[room].players =
        games[room].players.filter(p => p.socketId !== socket.id);

      if (games[room].players.length === 0) {
        delete games[room];
      }
    }
  });

};