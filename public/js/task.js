const { sequelize } = require("../../config");
const {Model, DataTypes} = require("sequelize");
const {Priority} = require('./Priority');

class Task extends Model {}

Task.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        priorityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Priority,
                key: 'id',
            },
        },
        finishDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        isDone: {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
        },
        creationTimeAsString: {
            type: DataTypes.VIRTUAL,
            get() {
                const currentYear = this.createdAt.getFullYear();
                const currentMonth = (this.createdAt.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                const currentDay = this.createdAt
                    .getDate()
                    .toString()
                    .padStart(2, "0");
                const currentHours = this.createdAt
                    .getHours()
                    .toString()
                    .padStart(2, "0");
                const currentMinutes = this.createdAt
                    .getMinutes()
                    .toString()
                    .padStart(2, "0");

                return `${currentDay}.${currentMonth}.${currentYear} ${currentHours}:${currentMinutes}`;
            },
        },
        finishDateAsString:
            {
                type: DataTypes.VIRTUAL,
                get() {
                    const finishDate = new Date(this.finishDate);

                    const currentYear = finishDate.getFullYear();
                    const currentMonth = (finishDate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                    const currentDay = finishDate
                        .getDate()
                        .toString()
                        .padStart(2, "0");

                    return `${currentDay}.${currentMonth}.${currentYear}`;
                }
        }
    },
    {
        sequelize,
        tableName: 'tasks',
        modelName: 'Task',
    },
)

Priority.hasMany(Task, { foreignKey: 'priorityId' });
Task.belongsTo(Priority, { foreignKey: 'priorityId' });

async function synchronize() {
    await sequelize.sync({ force: true })
}

// synchronize();

if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = { Task };
