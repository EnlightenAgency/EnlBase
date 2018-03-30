var express = require('express');
var router = express.Router();
var path = require('path');
var port = 16744 || process.env.PORT;

//Load unit Test page
router.get('/test', function (req, res, next) {
    res.render('test');
});
//Load angular page
router.get('*', function (req, res, next) {
    res.render('index');
});
module.exports = router;
