const gameState = require("../db/inMemoryDb");

module.exports = io => {
  io.on("connection", socket => {
    console.log(
      `A socket connection to npm server has been made: ${socket.id}`
    );

    socket.on("disconnect", () => {
      console.log(`Connection ${socket.id} has left the building`);
    });

    socket.on("test", () => {
      console.log(`Client ${socket.id} test`);
      io.emit("test");
    });

    socket.on("init", (roomName, ack) => {
      socket.join(roomName);
      const gameRoom = gameState.initGameRoom(roomName);
      gameState.addPlayerOne(gameRoom, socket.id, [1, 1, 1]);
      ack(gameRoom.joinToken);
      console.log(`Client ${socket.id} has started room "${roomName}"`);
    });

    socket.on("start", joinToken => {
      const gameRoom = gameState.getRoomByToken(joinToken.toString());
      if (!gameRoom) {
        socket.emit("incorrectGameToken");
        return;
      }
      gameState.addPlayerTwo(gameRoom, socket.id, [1, 1, 1]);
      gameState.startGame(gameRoom);
      console.log(`Client ${socket.id} has joined game. Game has started.`);
    });

    socket.on("spawn", (unitType, playerNo) => {
      const gameRoom = gameState.getRoom();
    });
  });
};
