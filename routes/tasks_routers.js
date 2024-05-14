const express = require("express");
const router = express.Router();
const pool = require("../config");

router.post("/tasks", async (req, res) => {
    const description = req.body.description;
    const priority = req.body.priority;
    const finishDate = req.body.finishDate;
    const creationTime = new Date();
    const isDone = false;

    const client = await pool.connect();

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

    client.release();

    res.json({ redirect: "/" });
});

router.get("/tasks", async (req, res) => {
    const client = await pool.connect();

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
    } finally {
        client.release();
    }
});


router.delete("/tasks", async (req, res) => {
    const client = await pool.connect();
    const taskId = req.body.taskId;
    const query = "DELETE FROM tasks WHERE task_id = $1";

    client.query(query, [taskId]);
    client.release();
    res.json({ redirect: "/" });
});

router.patch("/tasks", async (req, res) => {
    const client = await pool.connect();
    const taskId = req.body.taskId;
    const query = "UPDATE tasks SET isdone = NOT isdone WHERE task_id = $1";

    client.query(query, [taskId]);
    client.release();
    res.json({ redirect: "/" });
});


router.put("/tasks", async (req, res) => {
    const client = await pool.connect();
    const description = req.body.description;
    const priority = req.body.priority;
    const finishDate = req.body.finishDate;
    const creationTime = new Date();
    const task_id = req.body.taskId;

    const query =
        "UPDATE tasks SET description=$1, priority=$2, finishDate=$3, creationTime=$4 WHERE task_id=$5";

    try {
        await client.query('BEGIN');

        await client.query(query, [
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
    } finally {
        client.release();
    }
});


module.exports = router;
