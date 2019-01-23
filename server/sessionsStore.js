const sessions = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(sessions.Store);
const db = require('./db');
const sessionsStore = new SequelizeStore({ db });

module.exports = sessionsStore;
