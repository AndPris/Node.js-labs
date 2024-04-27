const express = require("express");
const fs = require("fs");
const router = express.Router();
const { Task } = require("../public/js/task");


const syncFileName = "todosSync.txt";

function saveSync(todo) {
    let todos;

    try {
        todos = JSON.parse(fs.readFileSync(syncFileName));
    } catch (err) {
        todos = [];
    }

    todos.push(todo);
    fs.writeFileSync(syncFileName, JSON.stringify(todos));
}
router.post('/tasks', (req, res) => {
    const description = req.body.description;
    const priority = req.body.priority;
    const finishDate = new Date(req.body.finishDate);

    const task = new Task(description, priority, finishDate);
    saveSync(task);
    res.json({ redirect: '/' });
});

router.get('/tasks', (req, res) => {
    const data = JSON.parse(fs.readFileSync(syncFileName));
    res.json(data);
});

router.delete('/tasks', (req, res) => {
    let tasks = JSON.parse(fs.readFileSync(syncFileName));
    const creationTimeOfTaskToDelete = new Date(req.body.creationTime);

    tasks = tasks.filter(task => {
        let creationTime = new Date(task._creationTime);
        creationTime.setMilliseconds(0);
        return creationTime.getTime() !== creationTimeOfTaskToDelete.getTime();
    });

    fs.writeFileSync(syncFileName, JSON.stringify(tasks));
    res.json({ redirect: '/' });
})

module.exports = router;
