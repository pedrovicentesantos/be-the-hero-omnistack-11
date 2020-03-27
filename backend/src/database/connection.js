const knex = require('knex');
const configuration = require('../../knexfile');

// const config = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development;
const env = process.env.NODE_ENV;
let config = configuration.development;
if (env === 'test') {
  config = configuration.test;
}

const connection = knex(config);

module.exports = connection;