require("dotenv").config();
const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.URL, {
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     }
// });
const sequelize = new Sequelize({
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: process.env.DBPORT,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: process.env.REJECTUNAUTHORIZED === "true",
            ca: process.env.CA ? process.env.CA : undefined,
        },
    },
    pool: {
        max: parseInt(process.env.MAX, 10),
        idle: parseInt(process.env.IDLETIMEOUTMILLS, 10),
        acquire: parseInt(process.env.CONNECTIONTIMEOUTMILLIS, 10),
    },
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = {sequelize};
