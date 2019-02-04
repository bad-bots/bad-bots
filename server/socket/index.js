const gameState = require('../db/inMemoryDb');

const getAllGameRoomIds  = rooms => {
  return Object.keys(rooms)
  .filter(room => room.includes('rId:'))
}

const getLatestRoom = rooms => {
  const roomNames = getAllGameRoomIds(rooms);

  let latestGame;
  let lastTime = -1;

  roomNames.forEach(roomId => {
    const gameRoom = gameState.getRoomByRoomId(roomId);
    if (gameRoom.meta.created > lastTime) {
      latestGame = gameRoom;
    }
  })

  return latestGame;
}

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to npm server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    // Create room and add room creator as P1
    socket.on('create', (roomName, ack) => {
      // Do not create debug room  because it is created on server init.
      if (roomName === 'debug') {
        return;
      }

      roomName = 'room:' + roomName;
      const gameRoom = gameState.createGameRoom(roomName);

      const player1 = gameState.createPlayer(1, socket.id, [1,1,1]);
      gameRoom.player1 = player1;
      socket.join(gameRoom.roomId)

      ack(gameRoom.joinToken);
      console.log(`Client ${socket.id} has created room "${roomName}"`);
    })

    socket.join('join', joinToken => {

      const gameRoom = gameState.getRoomByToken(joinToken);
      if (!gameRoom){
        socket.emit('incorrectGameToken');
        return
      }

      let playerAdded;

      if (gameRoom.player1 === null) {
        const player = gameState.createPlayerOne(socket.id, [0,0,0]);
        gameRoom.player1 = player;
        playerAdded = player;
      } else if(gameRoom.player2 === null) {
        const player = gameState.createPlayerTwo(socket.id, [1,1,1]);
        gameRoom.player2 = player;
        playerAdded = player
      } else {
        const specator = gameState.addSpectator(gameRoom, socket.id);
        gameRoom.spectators.push(specator);
        playerAdded=specator;
      }

      socket.join(gameRoom.roomId);

      // If gameRoom is the debug game room, then start the game
      // Otherwise start the game if both p1 and p2 have joined.
      if (joinToken === 'debug') {
        io.to(socket.id).emit('start', playerAdded)
      } else if (gameRoom.player1 && gameRoom.player2) {
        io.to(gameRoom.player1.socketId).emit('start', {enemyCastleHealth: gameRoom.player2.castleHealth, ...gameRoom.player1})
        io.to(gameRoom.player2.socketId).emit('start', {enemyCastleHealth: gameRoom.player1.castleHealth, ...gameRoom.player2})
      }
      console.log(`Client ${socket.id} has joined game. Game has started.`);
    })

    socket.on('spawn', ({unitType, position, rotation}) => {
      // Get latest game room
      const gameRoom = getLatestRoom(socket.rooms);
      if (!gameRoom) {
        socket.emit('match not found')
        console.log('room not found');
        return
      }

      // Get player requesting unit spawn from socket.id
      let player;
      if(socket.id === gameRoom.player1.socketId) {
        player = gameRoom.player1
      } else if(socket.id === gameRoom.player2.socketId) {
        player = gameRoom.player2
      } else {
          socket.emit('unauthorized player')
          console.log('player not found');
          return
      }

      // Set position if it is not provided
      if(!position) {
        position = player.playerNo === 1 ? [0,0,3.5] : [0,0,-3.5];
      }
      if(!rotation) {
        rotation = player.PlayerNo === 1 ? [0, 180, 0] : [0, 0, 0];
      }

      // Spawn unit if player has enough doubloons
      const cost = gameState.unitCost(unitType)
      if (player.doubloons >= cost) {
        const unit = gameState.createUnit(player.playerNo, unitType, position, rotation,);
        player.doubloons -= cost;
        gameRoom.units.push(unit)

        // Update player doubloons
        // Spawn unit
        socket.emit('updatePlayerState', player);
        io.to(gameRoom.roomId).emit('spawn', unit)
      } else {
        socket.emit('insufficientDoubloons');
      }

    })

    socket.on('damageUnit', ({unitType, attackedUnitId}) => {

    })

    socket.on('damageCastle', ({unitType, attackedPlayerNo}) => {
      // Get latest game room
      const gameRoom = getLatestRoom(socket.rooms);
      if (!gameRoom) {
        socket.emit('match not found')
        console.log('room not found');
        return
      }

      const damage = gameState.unitDamage(unitType);
      const attackedPlayer = gameRoom['player' + attackedPlayerNo]
      attackedPlayer.castleHealth -= damage;

      // Check to see if the game is over
      // Otherwise emit new castleHealth
      if(attackedPlayer.castleHealth <= 0) {
        const winningPlayer = 3 - attackedPlayerNo
        gameState.endGame(gameRoom, winningPlayer)
        io.to(gameRoom.roomId).emit('gameOver', winningPlayer)
      } else {
        io.to(gameRoom.roomId).emit('damageCastle', {
          playerNo: attackedPlayer.playerNo,
          castleHealth: attackedPlayer.castleHealth
        });
        
      }
    })

    socket.on('restart', () => {
      // Get latest game room
      const gameRoom = getLatestRoom(socket.rooms);
      if (!gameRoom) {
        socket.emit('match not found')
        console.log('room not found');
        return
      }
    })

    socket.on('leave', () => {
      // Remove every instance of the client in gameState
      // Client could be a player or a spectator
      gameState.destroyPlayer(socket.id);
      gameState.destorySpectator(socket.id);

      const roomNames = getAllGameRoomIds(socket.rooms);
      roomNames.forEach(roomName => {
        socket.leave(roomName);
        const gameRoom = gameState.getRoomByRoomId(roomName);
        
        // Destroy gameRoom if there are no players left;

      })
    })


  })
}
