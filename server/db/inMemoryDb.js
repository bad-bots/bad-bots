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
        this.Player = inMemDb.addCollection('player')
        this.Room = inMemDb.addCollection('rooms');
        this.Unit = inMemDb.addCollection('units');
        this.JoinToken = inMemDb.addCollection('joinTokens');
    }

    genJoinToken(roomName) {
        let joinToken;
        while (!joinToken) {
            const temp = Math.random().toString(36).substring(4);
            const tokenFound = this.JoinToken.findOne({token: temp})
            if (!tokenFound) {
                joinToken = temp;
            }
        }
        this.JoinToken.insert({token: joinToken, roomName})
        return joinToken
    }

    initGameRoom(roomName, p1SocketId, p1PhonePosition) {
        const joinToken = this.genJoinToken(roomName);

        return this.Room.insert({
            joinToken,
            player1: null,
            player2: null,
            roomName,
            gameStatus: 'pending',
            units: []
        })
    }

    getRoomByToken(joinToken) {
        return this.Room.findOne({joinToken})
    }

    getRoomByName(roomName) {
        return this.Room.findOne({roomName})
    }

    getPlayer(socketId) {
        return this.Player.findOne({socketId})
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


    spawnUnit(roomName, playerId, unitType, position) {
        if (roomName) {
            const unit = this.Unit.insert({
                health: 100,
                position,
                unitType,
                playerId,
                currentTarget: null,
                spawnTime: 5000
            })
            roomName.units.push(unit)
        }
    }

    unitCost(type) {
        switch (type) {
            case 'archer':
                return 1000
            case 'infantry':
                return 1500
            case 'spearman':
                return 2000
            default:
                return null
        }
    }

    createUnit(unitType, position, rotation, playerSocketId) {
        return this.Unit.insert({
            health: 100,
            position,
            unitType,
            playerSocketId,
            currentTarget: null,
            spawnTime: 5000
        })
    }

    updateUnit(data) {
        const unit = this.Unit.findAndUpdate({

        })
    }

}

const db = new MemDB();

module.exports = db