const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multer = require('multer');

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors_router");
const staticHTMLRouter = require("./routes/static_html_router");
const tasksRouter = require("./routes/tasks_routers");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(multer().none());

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static("public/images"));

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/static", staticHTMLRouter);
app.use("/", tasksRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
