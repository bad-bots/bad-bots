const app = require('./app');
const db = require('./db');
const sessionsStore = require('./sessionsStore');
const socketio = require('socket.io');

const PORT = process.env.SERVER_PORT;

db.authenticate()
  .then(() => {
    return sessionsStore.sync();
  })
  .then(() => {
    console.log('Session store has been synced');
    console.log('Connection to database established');
    return db.sync();
  })
  .then(() => {
    console.log('Database has been synced');

    const server = app.listen(PORT, () => {
      console.log('Listening on port', PORT);
    });

    const io = socketio(server);
    require('./socket')(io);
  })
  .catch(err => {
    console.error('Unable to start server', err);
  });
