const router = require('express').Router();

const { ResponseMessage } = require('../utils');

// Protecting routes
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const error = new Error('Unauthorized');
    error.name = 'Error 401';

    res.status(400).send(new ResponseMessage(null, error));
  }
};

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.name = 'Error 404';
  error.status = 404;
  next(error);
});

module.exports = router;
