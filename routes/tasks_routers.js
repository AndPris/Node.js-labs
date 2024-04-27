const express = require("express");
const fs = require("fs");
const router = express.Router();
const { Task } = require("../public/js/task");
const { route } = require(".");

const syncFileName = "todosSync.txt";

function saveSync(todo) {
    let todos;

    try {
        todos = JSON.parse(readSync());
    } catch (err) {
        todos = [];
    }

    todos.push(todo);
    fs.writeFileSync(syncFileName, JSON.stringify(todos));
}

function readSync() {
    return fs.readFileSync(syncFileName);
}

// Sync
router.post("/tasks", (req, res) => {
    const description = req.body.description;
    const priority = req.body.priority;
    const finishDate = new Date(req.body.finishDate);

    const task = new Task(description, priority, finishDate);
    saveSync(task);
    res.json({ redirect: "/" });
});

// Async callback
router.get("/tasks", (req, res) => {
    fs.readFile(syncFileName, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        res.json(JSON.parse(data));
    });
});

router.delete("/tasks", (req, res) => {
    let tasks = JSON.parse(readSync());
    const creationTimeOfTaskToDelete = new Date(req.body.creationTime);

    tasks = tasks.filter((task) => {
        let creationTime = new Date(task._creationTime);
        creationTime.setMilliseconds(0);
        return creationTime.getTime() !== creationTimeOfTaskToDelete.getTime();
    });

    fs.writeFileSync(syncFileName, JSON.stringify(tasks));
    res.json({ redirect: "/" });
});

router.patch("/tasks", (req, res) => {
    let tasks = JSON.parse(readSync());
    const creationTimeOfTaskToDelete = new Date(req.body.creationTime);

    taskIndex = tasks.findIndex((task) => {
        let creationTime = new Date(task._creationTime);
        creationTime.setMilliseconds(0);
        return creationTime.getTime() === creationTimeOfTaskToDelete.getTime();
    });

    console.log(tasks[taskIndex]._isDone);
    tasks[taskIndex]._isDone = !tasks[taskIndex]._isDone;
    console.log(tasks[taskIndex]._isDone);

    fs.writeFileSync(syncFileName, JSON.stringify(tasks));
    res.json({ redirect: "/" });
});

module.exports = router;
