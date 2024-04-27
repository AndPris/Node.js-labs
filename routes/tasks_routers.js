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
    res.redirect('/');
});

router.get('/tasks', (req, res) => {
    const data = JSON.parse(fs.readFileSync(syncFileName));
    res.json(data);
});

module.exports = router;
