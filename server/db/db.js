if (process.env.NODE_ENV === 'test') require('../../config/env');

const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const databaseName =
  pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '');

const databaseUrl =
  (process.env.DATABASE_URL || 'postgres://localhost:5432/') + databaseName;

const db = new Sequelize(databaseUrl, {
  logging: false
});
module.exports = db;
