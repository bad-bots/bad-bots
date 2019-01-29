require('../config/env');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors')
const compression = require('compression');
const sessions = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const sessionsStore = require('./sessionsStore');
const db = require('./db');
const apiRouter = require('./api');
const authRouter = require('./auth');
const { ResponseMessage } = require('./utils');

const app = express();

// passport registration
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id, {
      attributes: ['id', 'firstName', 'lastName', 'salt', 'password']
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  // logging middleware
  app.use(logger('dev'));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());

  // compression middleware
  app.use(compression());

  // session middleware with passport
  app.use(
    sessions({
      secret: process.env.CS_SECRET || 'Really weak secret',
      store: sessionsStore,
      resave: false,
      saveUninitialized: false,
      unset: 'destroy'
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // auth and api routes
  app.use('/auth', authRouter);
  app.use('/api', apiRouter);

  // static file-serving middleware
  app.use('/public', express.static(path.join(__dirname, '..', 'public')));

  // error handling endware
  app.use((err, req, res, next) => {
    // If you pass withFailError=true in passport.authenticate,
    // passportJS throws 500 error on login failure. Handle
    // that error here. Note: without the above option, passportJS
    // with will respond with text instead of JSON.
    if (err.name === 'AuthenticationError' && err.message === 'Unauthorized') {
      err.message = 'Incorrect email/password.';
    }
    res.status(err.status || 500).send(new ResponseMessage(null, err));
  });
};

createApp();

module.exports = app;
