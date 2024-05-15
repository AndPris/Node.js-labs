const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config');

const Priority = sequelize.define('Priority', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

async function addInitialValues() {
    await Priority.sync({force: true});

    try {
        await Priority.bulkCreate([
            {id: 1, description: 'High'},
            {id: 2, description: 'Medium'},
            {id: 3, description: 'Low'},
        ]);
    } catch (err) {
        console.log("----------------------------------------------------")
        console.log(err);
    }
}

// addInitialValues();

module.exports = {Priority};