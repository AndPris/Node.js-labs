require('dotenv').config();
const pg = require('pg');

const config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: {
        rejectUnauthorized: process.env.REJECTUNAUTHORIZED,
        ca: process.env.CA,
    },
};

const client = new pg.Client(config);
module.exports = client;