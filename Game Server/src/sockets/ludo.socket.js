module.exports = (io, socket) => {

  socket.on("join_room", roomId => {
    socket.join(roomId);
    io.to(roomId).emit("player_joined", socket.id);
  });

  socket.on("roll_dice", roomId => {
    const dice = Math.floor(Math.random() * 6) + 1;
    io.to(roomId).emit("dice_result", dice);
  });

};