require("dotenv").config();
const pg = require("pg");
const { Pool } = pg;

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
    max: process.env.MAX,
    idleTimeoutMillis: process.env.IDLETIMEOUTMILLS,
    connectionTimeoutMillis: process.env.CONNECTIONTIMEOUTMILLIS,
};

const pool = new Pool(config);

module.exports = pool
