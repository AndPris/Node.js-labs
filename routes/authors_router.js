const express = require("express");
const router = express.Router();

router.get('/Andrii', (req, res, next) => {
    res.render('authors_info', {
        name: "Andrii Prysiazhnyi",
        text: "Hello, my name is Andrii",
        photo: "images/icon.jpg"
    });
});

module.exports = router;