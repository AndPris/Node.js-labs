const express = require("express");
const router = express.Router();
const {Task}= require("../public/js/task");
const {Priority}= require("../public/js/priority");
const {Sequelize} = require("sequelize");

router.post("/tasks", async (req, res) => {
    try {
        await Task.create({description: req.body.description, priorityId: req.body.priority, finishDate: req.body.finishDate});

        res.json({redirect: "/"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: {
                model: Priority,
            },
        });
        res.json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete("/tasks", async (req, res) => {
    await Task.destroy(
        { where: { id: req.body.taskId, }, },
    );
    res.json({ redirect: "/" });
});

router.patch("/tasks", async (req, res) => {
    await Task.update(
        { isDone: Sequelize.literal('NOT "isDone"') },
        { where: { id: req.body.taskId, }, },
    );
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
