const loki = require('lokijs');
const inMemDb = new loki('games.json');

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



// Add room and player1 to db
class MemDB {
    
    constructor() {
        this.Player = inMemDb.addCollection('player')
        this.Room = inMemDb.addCollection('rooms');
        this.Unit = inMemDb.addCollection('units');
    }

    initGameRoom(roomName, p1SocketId, p1PhonePosition) {
        return this.Room.insert({
            joinToken: (this.Room.count() + 1).toString(), // May fail for Asyc operations.
            player1: null,
            player2: null,
            roomName,
            gameStatus: 'pending',
            units: null
        })
    }

    getRoomByToken(joinToken) {
        return this.Room.findOne({joinToken})
    }

    addPlayer(playerNo, room, socketId, phonePosition) {
        const player = this.Player.insert({
                socketId,
                castleHealth: 1000,
                doubloons: 10000,
                phonePosition,
                coolDowns: {
                unitType: 0
                }
        });
        room[playerNo] = player;
    }

    addPlayerOne(room, socketId, phonePosition) {
        this.addPlayer('player1', room, socketId, phonePosition)
    }

    addPlayerTwo(room, socketId, phonePosition) {
        this.addPlayer('player2', room, socketId, phonePosition)
    }

    // Add p2 to db and update game status
    startGame(gameRoom) {
        gameRoom.gameStatus = 'inPlay'
    }

    pauseGame(gameRoom) {
        gameRoom.gameStatus = 'paused'
    }

    destroyGame(roomName) {
        this.Room.findAndRemove({roomName})
    }


    spawnUnit(roomId, playerId, unitType, position) {
        const room = this.Room.findOne({roomId})
        if (room) {
            const unit = this.Unit.insert({
                health: 100,
                position,
                unitType,
                playerId,
                currentTarget: null,
                spawnTime: 5000
            })
            room.units.push(unit)
        }
    }

    updateUnit(data) {
        const unit = this.Unit.findAndUpdate({

        })
    }

}

const db = new MemDB();

module.exports = db