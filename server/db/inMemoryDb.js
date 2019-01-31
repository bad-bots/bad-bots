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
 *  gameStatus: 'inPlay',
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
 * Find
 * rooms.find({player1: 55});
 * rooms.findOne({player2: 23});
 *
 * rooms.findAndUpdate({roomId: 234}, )
 * rooms.update({})
 * rooms.updateWhere(obj => {
 *  obj.gameId === 55
 * }, {})
 */

class MemDB {
  constructor() {
    this.Player = inMemDb.addCollection("player");
    this.Room = inMemDb.addCollection("rooms");
    this.Unit = inMemDb.addCollection("units");
    this.JoinToken = inMemDb.addCollection("joinTokens");
    this.debugRoom = this.createDebugRoom();
  }

  createDebugRoom() {
    return this.Room.insert({
      joinToken: 'debug',
      player1: null,
      player2: null,
      roomName: 'room:debug',
      gameStatus: "pending",
      units: []
    });
  }

  joinDebugRoom(io, socketId) {
    let player;
    if (!this.debugRoom.player1) {
      player = this.addPlayerOne(this.debugRoom, socketId, [0,0,0]);
    }
    else if(!this.debugRoom.player2) {
      player = this.addPlayerTwo(this.debugRoom, socketId, [1,1,1]);
    }
    io.to(socketId).emit('start', player)
  }

  genJoinToken(roomName) {
    let joinToken;
    while (!joinToken) {
      const temp = Math.random()
        .toString(36)
        .substring(6);
      const tokenFound = this.JoinToken.findOne({ token: temp });
      if (!tokenFound) {
        joinToken = temp;
      }
    }
    this.JoinToken.insert({ token: joinToken, roomName });
    return joinToken;
  }

  initGameRoom(roomName, p1SocketId, p1PhonePosition) {
    const joinToken = this.genJoinToken(roomName);

    return this.Room.insert({
      joinToken,
      player1: null,
      player2: null,
      roomName,
      gameStatus: "pending",
      units: []
    });
  }

  getRoomByToken(joinToken) {
    return this.Room.findOne({ joinToken });
  }

  getRoomByName(roomName) {
    return this.Room.findOne({ roomName });
  }

  getPlayer(socketId) {
    return this.Player.findOne({ socketId });
  }

  addPlayer(playerNo, room, socketId, phonePosition) {
    const player = this.Player.insert({
      socketId,
      playerNo,
      castleHealth: 1000,
      doubloons: 10000,
      phonePosition,
      coolDowns: {
        knight: 0
      }
    });
    room["player" + playerNo] = player;
    return player
  }

  addPlayerOne(room, socketId, phonePosition) {
    return this.addPlayer(1, room, socketId, phonePosition);
  }

  addPlayerTwo(room, socketId, phonePosition) {
    return this.addPlayer(2, room, socketId, phonePosition);
  }

  // Add p2 to db and update game status
  startGame(gameRoom) {
    gameRoom.gameStatus = "inPlay";
  }

  pauseGame(gameRoom) {
    gameRoom.gameStatus = "paused";
  }

  destroyGame(roomName) {
    this.Room.findAndRemove({ roomName });
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

  updateUnit(data) {
    const unit = this.Unit.findAndUpdate({});
  }
}

const db = new MemDB();

module.exports = db;
