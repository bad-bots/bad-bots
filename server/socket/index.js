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

<<<<<<< Updated upstream
<<<<<<< HEAD
    socket.on('init', roomName => {
=======
    socket.on('init', (roomName, ack) => {
>>>>>>> Stashed changes
      socket.join('room:' + roomName);
=======
    socket.on("init", (roomName, ack) => {
      socket.join(roomName);
>>>>>>> 3316c734bac0f9c05dcd3f3dd1620e6376293661
      const gameRoom = gameState.initGameRoom(roomName);
      gameState.addPlayerOne(gameRoom, socket.id, [1, 1, 1]);
      ack(gameRoom.joinToken);
      console.log(`Client ${socket.id} has started room "${roomName}"`);
<<<<<<< Updated upstream
    });

    socket.on("start", joinToken => {
      const gameRoom = gameState.getRoomByToken(joinToken.toString());
      if (!gameRoom) {
        socket.emit("incorrectGameToken");
        return;
=======
      ack(gameRoom.joinToken);
    })

    socket.on('start', joinToken => {
      console.log(`P2 attemping to join room with token ${joinToken}`);
      const gameRoom = gameState.getRoomByToken(joinToken);
      if (!gameRoom){
        socket.emit('incorrectGameToken')
        return
>>>>>>> Stashed changes
      }
      socket.join(gameRoom.roomName);
      gameState.addPlayerTwo(gameRoom, socket.id, [1, 1, 1]);
      gameState.startGame(gameRoom);
      io.to(gameRoom.roomName).emit("start", gameRoom);
      console.log(`Client ${socket.id} has joined game. Game has started.`);
    });

<<<<<<< HEAD
    // Old implementation
    socket.on('spawn unit', data => {
      console.log(data)
      const unit = gameState.createUnit(data.unitType, data.position, data.rotation, socket.id);
      socket.emit('spawn unit', unit)
    })

    // New implementation
    socket.on('spawn', (unitType, position, rotation) => {
      const roomName = Object.keys(socket.rooms)
      .filter(room => room.includes('room:'))[0]
      
      const gameRoom = gameState.getRoomByName(roomName)
      if (!gameRoom) {
        socket.emit('match not found')
      }

      const player = gameState.getPlayer(socket.id);
      if(!player) {
        socket.emit('match not found')
      }

      const cost = gameState.unitCost(unitType)

      if (player.doubloon >= cost) {
        const unit = gameState.createUnit(unitType, position, rotation, socket.id);
        player.doubloons -= cost;
        gameRoom.push(unit)
        socket.emit('unit', unit)
      } else {
        socket.emit('insufficientDoubloons');
      }
    })

  })
}
=======
    socket.on("spawn", data => {
      console.log("Player request unit spawn", data);
      io.emit("spawn", data);
    });
  });
};
>>>>>>> 3316c734bac0f9c05dcd3f3dd1620e6376293661
