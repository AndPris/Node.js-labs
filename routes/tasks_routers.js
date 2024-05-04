const express = require("express");
const router = express.Router();
const { Task } = require("../public/js/task");
const client = require("../config");

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
    const query = "SELECT * FROM tasks ORDER BY isdone, creationtime";
    let result = await client.query(query);
    res.json(result.rows);
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

module.exports = router;
