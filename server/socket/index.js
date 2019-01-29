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

    socket.on('join', room => {
      socket.join(room)
    })
  })
}
