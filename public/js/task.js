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
            validate: {
                notEmpty: {
                    msg: "Provide description, please"
                },
            },
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
            validate: {
                isGreaterThanToday(value) {
                    if ((new Date(value)).getDate() < (new Date()).getDate()) {
                        throw new Error('Finish date must not be less than today');
                    }
                }
            }
        },
        isDone: {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN,
        },
        creationTimeAsString: {
            type: DataTypes.VIRTUAL,
            get() {
                if(!this.updatedAt)
                    return;

                const currentYear = this.updatedAt.getFullYear();
                const currentMonth = (this.updatedAt.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                const currentDay = this.updatedAt
                    .getDate()
                    .toString()
                    .padStart(2, "0");
                const currentHours = this.updatedAt
                    .getHours()
                    .toString()
                    .padStart(2, "0");
                const currentMinutes = this.updatedAt
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
                    if(!this.finishDate)
                        return;

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
    // await sequelize.sync({ force: true })
    await Task.sync({alter: true});
}

synchronize();

if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = { Task };
