const express = require("express");
const router = express.Router();

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const currentDate = `${year}-${month}-${day}`;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "ToDo", currentPage: req.path, currentDate: currentDate});
});

module.exports = router;
