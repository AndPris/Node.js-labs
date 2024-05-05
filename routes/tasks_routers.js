const express = require("express");
const router = express.Router();
const { Task } = require("../public/js/task");
const client = require("../config");
const {continueSession} = require("pg/lib/crypto/sasl");

function getCurrentDateTime() {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");
    const currentDay = today.getDate().toString().padStart(2, "0");

    const currentHours = today.getHours().toString().padStart(2, "0");
    const currentMinutes = today.getMinutes().toString().padStart(2, "0");
    const currentSeconds = today.getSeconds().toString().padStart(2, "0");

    return `${currentYear}-${currentMonth}-${currentDay} ${currentHours}:${currentMinutes}:${currentSeconds}`;
}

router.post("/tasks", async (req, res) => {
    const description = req.body.description;
    const priority = req.body.priority;
    const finishDate = req.body.finishDate;
    const creationTime = new Date();
    const isDone = false;

    const query =
        "INSERT INTO tasks(description, priority, finishDate, creationTime, isDone) VALUES ($1, $2, $3, $4, $5)";
    let result = await client.query(query, [
        description,
        priority,
        finishDate,
        creationTime,
        isDone,
    ]);
    console.log(result);

    res.json({ redirect: "/" });
});

router.get("/tasks", async (req, res) => {
    const sortOrders = JSON.parse(req.query.sortOrders);
    let orderByClause = 'ORDER BY isdone ASC';

    sortOrders.forEach((sortOrder) => {
        if(sortOrder[1] === 0)
            return;

        if(sortOrder[0] === "priority")
            orderByClause += ", priority";
        else if (sortOrder[0] === "finishDate")
            orderByClause += ", finishdate";
        else
            return;

        let order = sortOrder[1] === 1 ? " ASC" : " DESC";
        orderByClause += order;
    });

    const query = `SELECT * FROM tasks ${orderByClause}`;

    try {
        let result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete("/tasks", (req, res) => {
    const taskId = req.body.taskId;
    const query = "DELETE FROM tasks WHERE task_id = $1";

    client.query(query, [taskId]);

    res.json({ redirect: "/" });
});

router.patch("/tasks", async (req, res) => {
    const taskId = req.body.taskId;
    const query = "UPDATE tasks SET isdone = NOT isdone WHERE task_id = $1";

    client.query(query, [taskId]);

    res.json({ redirect: "/" });
});


router.put("/tasks", async (req, res) => {
    const description = req.body.description;
    const priority = req.body.priority;
    const finishDate = req.body.finishDate;
    const creationTime = new Date();
    const task_id = req.body.taskId;

    const query =
        "UPDATE tasks SET description=$1, priority=$2, finishDate=$3, creationTime=$4 WHERE task_id=$5";

    try {
        await client.query('BEGIN');

        let result = await client.query(query, [
            description,
            priority,
            finishDate,
            creationTime,
            task_id,
        ]);

        await client.query('COMMIT');

        res.json({ redirect: "/" });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error in transaction', e);

        let errorMessage = "Unexpected error!";
        if (e.constraint === 'description_min_length')
            errorMessage = "Provide valid description, please!";
        else if (e.constraint === 'finishdate_check')
            errorMessage = "Provide valid finish date, please!";

        res.json({ error_message: errorMessage });
    }
});


module.exports = router;
