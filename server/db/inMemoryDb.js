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

const Player = inMemDb.addCollection('player')
const Room = inMemDb.addCollection('rooms');
const Unit = inMemDb.addCollection('units');


// Add room and player1 to db
class inMemDb {
    
    initGameRoom(roomId, p1SocketId, p1PhonePosition) {
        const player1 = Player.insert({
            socketId: p1SocketId,
            castleHealth: 1000,
            doubloons: 10000,
            phonePosition: p1PhonePosition,
            coolDowns: {
            unitType: 0
            }
        })

        return Room.insert({
            joinToken: (Room.count() + 1).toString(), // May fail for Asyc operations.
            player1,
            player2: null,
            roomId,
            gameStatus: 'pending',
            units: null
        })
    }

    // Add p2 to db and update game status
    startGame(joinToken, p2SocketId, p2PhonePosition) {
        const player2 = Player.insert({
            socketId: p2SocketId,
            castleHealth: 1000,
            doubloons: 10000,
            phonePosition: p2PhonePosition,
            coolDowns: {
            unitType: 0
            }
        })

        return Room.findAndUpdate({joinToken}, docs => {
            // Expecting only 1
            docs[0].player2 = player2
            docs[0].gameStatus = 'inPlay'
        })

    }

    pauseGame(roomId) {
        Room.findAndUpdate({roomId}, docs => {
            // Expecting only 1
            docs[0].gameStatus = 'paused'
        })
    }

    playGame(roomId) {
        Room.findAndUpdate({roomId}, docs => {
            // Expecting only 1
            docs[0].gameStatus = 'inPlay'
        })
    }

    destroyGame(roomId) {
        Room.findAndRemove({roomId})
    }


    spawnUnit(roomId, playerId, unitType, position) {
        const room = Room.findOne({roomId})
        if (room) {
            const unit = Unit.insert({
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
        const unit = Unit.findAndUpdate({

        })
    }

}
module.exports = inMemDb