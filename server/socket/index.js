const memDb = require('../db/inMemoryDb');

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

    socket.on('start', room => {
      socket.join(room)
      memDb.initGameRoom(room, socket.id, [1,1,1]) // 3rd argument is phone location
    })

  })
}
