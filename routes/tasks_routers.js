const express = require("express");
const router = express.Router();
const { Task } = require("../public/js/task");
const client = require("../config");


function getCurrentDateTime() {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = (today.getMonth() + 1)
        .toString()
        .padStart(2, "0");
    const currentDay = today
        .getDate()
        .toString()
        .padStart(2, "0");

    const currentHours = today.getHours()
        .toString()
        .padStart(2, "0");
    const currentMinutes = today.getMinutes()
        .toString()
        .padStart(2, "0");
    const currentSeconds = today.getSeconds()
        .toString()
        .padStart(2, "0");

    return `${currentYear}-${currentMonth}-${currentDay} ${currentHours}:${currentMinutes}:${currentSeconds}`;
}

router.post("/tasks", async (req, res) => {
    const description = req.body.description;
    const priority = req.body.priority;
    const finishDate = req.body.finishDate;
    const creationTime = new Date();
    const isDone = false;

    await client.connect();

    const query = 'INSERT INTO tasks(description, priority, finishDate, creationTime, isDone) VALUES ($1, $2, $3, $4, $5)';
    let result = await client.query(query, [description, priority, finishDate, creationTime, isDone]);
    console.log(result);

    await client.end();

    res.json({ redirect: "/" });
});

router.get("/tasks", async (req, res) => {
    // await client.connect();
    console.log("asdf");
    const query = 'SELECT * FROM tasks';
    let result = await client.query(query);
    console.log("before");
    console.log(result.rows);
    console.log("after");

    await client.end();
});


router.delete("/tasks", (req, res) => {
    let tasks = [];
    const creationTimeOfTaskToDelete = new Date(req.body.creationTime);

    res.json({ redirect: "/" });
});


router.patch("/tasks", async (req, res) => {

    res.json({ redirect: "/" });
});

module.exports = router;
