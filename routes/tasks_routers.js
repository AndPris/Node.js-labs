const express = require("express");
const router = express.Router();
const {Task}= require("../public/js/task");
const {Priority}= require("../public/js/priority");
const {Sequelize} = require("sequelize");
const {sequelize} = require("../config");

router.post("/", async (req, res) => {
    try {
        await Task.create({description: req.body.description, priorityId: req.body.priority, finishDate: req.body.finishDate});

        res.status(201).json({redirect: "/tasks"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/", async (req, res) => {
    try {
        if (req.get("LoadTasks") !== "true") {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const currentDate = `${year}-${month}-${day}`;
            res.status(200).render("index", {title: "ToDo", currentPage: req.path, currentDate: currentDate});
            return;
        }

        const sortOrders = JSON.parse(req.query.sortOrders);
        const order = [];
        const page = parseInt(req.query.page) || 0;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const offset = page * pageSize;

        sortOrders.forEach((sortOrder) => {
            if (sortOrder[1] === 0) return;

            let column;
            if (sortOrder[0] === "priority") {
                column = 'priorityId';
            } else if (sortOrder[0] === "finishDate") {
                column = 'finishDate';
            } else {
                return;
            }

            const direction = sortOrder[1] === 1 ? 'ASC' : 'DESC';
            order.push([column, direction]);
        });

        if (order.length === 0) {
            order.push(['isDone', 'ASC']);
        }

        const tasks = await Task.findAll({
            offset,
            limit: pageSize,
            include: {
                model: Priority,
            },
            order
        });

        const totalTasks = await Task.count();
        const tasksRemaining = totalTasks - offset - pageSize;

        res.status(200).json({
            tasks,
            isTasksLeft: tasksRemaining > 0
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/:description", async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: {
                description: req.params.description
            },
            include: {
                model: Priority,
            },
        });
        res.status(200).json(tasks);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete("/:taskId", async (req, res) => {
    try {
        await Task.destroy(
            { where: { id: req.params.taskId, }, },
        );
        res.status(200).json({ redirect: "/tasks" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.patch("/:taskId", async (req, res) => {
    try {
        await Task.update(
            { isDone: Sequelize.literal('NOT "isDone"') },
            { where: { id: req.params.taskId, }, },
        );
        res.json({ redirect: "/tasks" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put("/:taskId", async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        await Task.update(
            { description: req.body.description, priorityId: req.body.priority, finishDate: req.body.finishDate},
            { where: { id: req.params.taskId, }, },
            {transaction: transaction},
        );

        await transaction.commit();

        res.status(200).json({ redirect: "/tasks" });
    } catch (e) {
        await transaction.rollback();
        console.error('Error in transaction', e);

        let errorMessage = e.message ? e.message : "Unexpected error!";

        res.status(400).json({ error_message: errorMessage });
    }
});


module.exports = router;
