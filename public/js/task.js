class Task {
    constructor(
        id,
        description,
        priority,
        finishDate,
        creationTime,
        isDone = false
    ) {
        this._id = id;
        this._description = description;
        this._priority = parseInt(priority);
        this._finishDate = new Date(finishDate);
        this._creationTime = creationTime ? new Date(creationTime) : new Date();
        this._isDone = isDone;
    }

    get creationTimeAsString() {
        const currentYear = this._creationTime.getFullYear();
        const currentMonth = (this._creationTime.getMonth() + 1)
            .toString()
            .padStart(2, "0");
        const currentDay = this._creationTime
            .getDate()
            .toString()
            .padStart(2, "0");
        const currentHours = this._creationTime
            .getHours()
            .toString()
            .padStart(2, "0");
        const currentMinutes = this._creationTime
            .getMinutes()
            .toString()
            .padStart(2, "0");

        return `${currentDay}.${currentMonth}.${currentYear} ${currentHours}:${currentMinutes}`;
    }

    get id() {
        return this._id;
    }

    get creationTime() {
        return this._creationTime;
    }

    get priority() {
        return this._priority;
    }

    get priorityAsString() {
        if (this._priority === 1) return "High";
        if (this._priority === 2) return "Medium";
        if (this._priority === 3) return "Low";
    }

    get description() {
        return this._description;
    }

    get isDone() {
        return this._isDone;
    }

    get finishDateAsString() {
        const currentYear = this._finishDate.getFullYear();
        const currentMonth = (this._finishDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
        const currentDay = this._finishDate
            .getDate()
            .toString()
            .padStart(2, "0");

        return `${currentDay}.${currentMonth}.${currentYear}`;
    }

    get finishDate() {
        return this._finishDate;
    }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = { Task };
