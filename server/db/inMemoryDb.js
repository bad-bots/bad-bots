const loki = require("lokijs");
const inMemDb = new loki("games.json");

/**
 *  GameRoom = {
 *  id: 1 //auto created
 *  player1: {
 *      id: 1 //auto created
 *      socketId: sockdeId
 *      castleHealth: 1000,
 *      doubloons: 10000,
 *      phonePosition: [1,2,3],
 *      coolDowns: {
 *          unitType: time
 *      }
 *  },
 *  player2: { ... },
 *  roomId: roomId,
 *  gameStatus: 'inPlay', // or ['paused','finished']
 *  units: [
 *      {
 *          id: 1
 *          health: 100,
 *          position: [1,12,3],
 *          rotation: [0,0,0].
 *          playerId: 1,
 *          unitType: 'archer',
 *          spawnTime: 100000
 *          currentTarget: 2
 *      },
 *      { ... }
 *      ],
 * })
 * }
 *
 * Insert
 * rooms.insert({roomId: 'asdfa', joinToken: 1})
 * 
 * Find
 * rooms.find({player1: 55});
 * rooms.findOne({player2: 23});
 * 
 * Update
 * rooms.findAndUpdate({roomId: 234}, )
 * rooms.update({})
 * rooms.updateWhere(obj => {
 *  obj.gameId === 55
 * }, {...})
 */

class MemDB {
  constructor() {
    this.Player = inMemDb.addCollection("player");
    this.Spectator = inMemDb.addCollection("spectators");
    this.Room = inMemDb.addCollection("rooms");
    this.RoomId = inMemDb.addCollection("roomIds");
    this.Unit = inMemDb.addCollection("units");
    this.JoinToken = inMemDb.addCollection("joinTokens");
    this.debugRoom = this.createDebugRoom();
  }

  createDebugRoom() {
    return this.Room.insert({
      roomId: 'debug',
      joinToken: 'debug',
      player1: null,
      player2: null,
      roomName: 'room:debug',
      gameStatus: "pending",
      units: []
    });
  }

  genRoomId(roomName) {
    let roomId;
    while (!roomId) {
      const temp = Math.random()
        .toString(36)
        .substring(2);
      const roomIdExists = this.RoomId.findOne({ roomId: temp });
      if (!roomIdExists) {
        roomId = temp;
      }
    }
    return this.RoomId.insert({ roomId, roomName });
  }

  joinDebugRoom(io, socketId, phonePosition) {
    let player;
    if (!this.debugRoom.player1) {
      player = this.createPlayer(1, socketId, phonePosition)
      this.debugRoom.player1 = player;
    }
    else if(!this.debugRoom.player2) {
      player = this.createPlayer(2, socketId, phonePosition)
      this.debugRoom.player2 = player
    }
    io.to(socketId).emit('start', player)
  }

  genJoinToken(roomName) {
    let joinToken;
    while (!joinToken) {
      const temp = Math.random()
        .toString(36)
        .substring(8);
      const tokenFound = this.JoinToken.findOne({ token: temp });
      if (!tokenFound) {
        joinToken = temp;
      }
    }
    this.JoinToken.insert({ token: joinToken, roomName });
    return joinToken;
  }

  createGameRoom(roomName) {
    const joinToken = this.genJoinToken(roomName);
    const roomId = this.genRoomId('rId:' + roomName);
    
    return this.Room.insert({
      roomId,
      joinToken,
      roomName,
      gameStatus: "pending",
      winner: null,
      player1: null,
      player2: null,
      spectators: [],
      units: []
    });
  }

  getRoomByToken(joinToken) {
    return this.Room.findOne({ joinToken });
  }

  getRoomByRoomId(roomId) {
    return this.Room.findOne({ roomId });
  }

  getPlayer(socketId) {
    return this.Player.findOne({ socketId });
  }

  destroyPlayer(socketId) {
    this.Player.findAndRemove({socketId})
  }

  destorySpectator(socketId) {
    this.Spectator.findAndRemove({socketId})
  }

  createPlayer(playerNo, socketId, phonePosition) {
    return this.Player.insert({
      socketId,
      playerNo,
      castleHealth: 1000,
      doubloons: 10000,
      phonePosition,
      coolDowns: {
        knight: 0
      }
    });
  }

  createSpectator(room, socketId) {
    return this.Spectator.insert({
      socketId
    })
  }

  // Add p2 to db and update game status
  startGame(gameRoom) {
    gameRoom.gameStatus = "inPlay";
  }

  pauseGame(gameRoom) {
    gameRoom.gameStatus = "paused";
  }

  endGame(gameRoom, playerNo) {
    gameRoom.gameStatus = "finished";
    gameRoom.winner = gameRoom.winner = playerNo
  }

  destroyGame(roomId) {
    this.Room.findAndRemove({ roomId });
  }

  unitCost(type) {
    switch (type) {
      case "archer":
        return 10;
      case "knight":
        return 15;
      case "spearman":
        return 20;
      default:
        return 10;
    }
  }

  unitDamage(type) {
    switch (type) {
      case "archer":
        return 100;
      case "knight":
        return 150;
      case "spearman":
        return 200;
      default:
        return 100;
    }
  }


  createUnit(playerNo, unitType, position, rotation) {
    return this.Unit.insert({
      health: 100,
      position,
      rotation,
      unitType,
      playerNo,
      currentTarget: null,
      spawnTime: 5000
    });
  }
}

const db = new MemDB();

module.exports = db;
