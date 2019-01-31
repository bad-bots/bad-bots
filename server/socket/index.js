const gameState = require('../db/inMemoryDb');

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to npm server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('test', () => {
      console.log(`Client ${socket.id} test`);
      io.emit('test')
    })

    socket.on('init', (roomName, ack) => {
      roomName = 'room:' + roomName;
      socket.join(roomName);
      const gameRoom = gameState.initGameRoom(roomName);
      gameState.addPlayerOne(gameRoom, socket.id, [1,1,1]);
      ack(gameRoom.joinToken);
      console.log(`Client ${socket.id} has started room "${roomName}"`);
    })

    socket.on('start', joinToken => {
      if (joinToken === 'debug') {
        gameState.joinDebugRoom(io, socket.id);
        socket.join('room:debug');
        return
      }

      console.log(`P2 attemping to join room with token ${joinToken}`);
      const gameRoom = gameState.getRoomByToken(joinToken);
      if (!gameRoom){
        socket.emit('incorrectGameToken')
        return
      }

      socket.join(gameRoom.roomName);
      gameState.addPlayerTwo(gameRoom, socket.id, [1,1,1]);
      gameState.startGame(gameRoom);

      io.to(gameRoom.player1.socketId).emit('start', gameRoom.player1)

      io.to(gameRoom.player2.socketId).emit('start', gameRoom.player2)

      console.log(`Client ${socket.id} has joined game. Game has started.`);
    })

    // old implementation
    socket.on('spawn', data => {
      const roomName = Object.keys(socket.rooms)
      .filter(room => room.includes('room:'))[0]
      
      const gameRoom = gameState.getRoomByName(roomName)
      if (!gameRoom) {
        socket.emit('match not found')
        console.log('room not found');
        return
      }

      const player = gameState.getPlayer(socket.id);
      if(!player) {
        socket.emit('match not found')
        console.log('player not found');
        return
      }

      const unitType = 'knight';
      const cost = gameState.unitCost(unitType)

      if (player.doubloons >= cost) {
        const unit = gameState.createUnit(player.playerNo, unitType, data.position, data.rotation,);
        player.doubloons -= cost;
        gameRoom.units.push(unit)

        socket.emit('updatePlayerState', player);
        io.to(gameRoom.roomName).emit('spawn', unit)
      } else {
        socket.emit('insufficientDoubloons');
      }
    })
    

    socket.on('spawn new', unitType => {
      const roomName = Object.keys(socket.rooms)
      .filter(room => room.includes('room:'))[0];

      const gameRoom = gameState.getRoomByName(roomName)
      if (!gameRoom) {
        socket.emit('match not found')
      }

      const player = gameState.getPlayer(socket.id);
      if(!player) {
        socket.emit('match not found')
      }

      const cost = gameState.unitCost(unitType)

      if (player.doubloons >= cost) {
        const position = player.playerNo === 1 ? [0,0,3.5] : [0,0,-3.5];
        const rotation = player.PlayerNo === 1 ? [0, 180, 0] : [0, 0, 0];

        const unit = gameState.createUnit(player.playerNo, unitType, position, rotation);
        player.doubloons -= cost;
        gameRoom.units.push(unit)

        socket.emit('updatePlayerState', player); // Update $$
        io.to(gameRoom.roomName).emit('spawn', unit);
      } else {
        socket.emit('insufficientDoubloons');
      }
    })

    socket.on('damage castle', unitType => {
      const roomName = Object.keys(socket.rooms)
      .filter(room => room.includes('room:'))[0];

      const gameRoom = gameState.getRoomByName(roomName);
      const damage = gameState.unitDamage(unitType);
      const attackedPlayer = gameRoom.player1.socketId === socket.id 
        ? gameRoom.player2
        : gameRoom.player1

      attackedPlayer.castleHealth -= damage;
      io.to(roomName).emit('damage castle', {
        playerNo: attackedPlayer.playerNo,
        castleHealth: attackedPlayer.castleHealth
      });
    })
  })
}
