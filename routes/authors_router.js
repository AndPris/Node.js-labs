const express = require("express");
const router = express.Router();

router.get("/Andrii", (req, res, next) => {
  res.render("authors_info", {
    name: "Andrii Prysiazhnyi",
    text: "Hello, my name is Andrii",
    photo: "images/andrii_icon.jpg",
  });
});

router.get("/Anton", (req, res, next) => {
  res.render("authors_info", {
    name: "Anton Bur",
    text: "Hello, my name is Anton",
    photo: "images/anton_icon.jpg",
  });
});

router.get("/Max", (req, res, next) => {
  res.render("authors_info", {
    name: "Max Tiutiunnyk",
    text: "Hello, my name is Max",
    photo: "images/max_icon.jpg",
  });
});

module.exports = router;
