require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`,
    migrations: {
      directory: __dirname + '/database/migrations',
      seeds: __dirname + '/database/seeds'
    },
    pool: { min:0, max:10}
  },

  production: {
    client: 'pg',
    connection: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`,
    migrations: {
      directory: __dirname + '/database/migrations'
    },
    seeds: {
      directory: __dirname + '/database/seeds'
    },
    pool: { min:0, max:10}
  }
};