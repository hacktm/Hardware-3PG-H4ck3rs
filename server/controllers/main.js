var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if (req.user)
    {
        res.redirect("/dashboard");
        return;
    }

    res.render('index.html');
});

router.get("/dashboard", function (req, res) {
    res.render("dashboard.html")
});

module.exports = router;
