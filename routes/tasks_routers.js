const express = require("express");
const router = express.Router();
const {Task}= require("../public/js/task");
const {Priority}= require("../public/js/priority");
const {Sequelize} = require("sequelize");
const {sequelize} = require("../config");

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
    const sortOrders = JSON.parse(req.query.sortOrders);
    const order = [];

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

    try {
        const tasks = await Task.findAll({
            include: {
                model: Priority,
            },
            order
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
    const transaction = await sequelize.transaction();

    try {
        await Task.update(
            { description: req.body.description, priorityId: req.body.priority, finishDate: req.body.finishDate},
            { where: { id: req.body.taskId, }, },
            {transaction: transaction},
        );

        await transaction.commit();

        res.json({ redirect: "/" });
    } catch (e) {
        await transaction.rollback();
        console.error('Error in transaction', e);

        let errorMessage = e.message ? e.message : "Unexpected error!";

        res.json({ error_message: errorMessage });
    }
});


module.exports = router;
