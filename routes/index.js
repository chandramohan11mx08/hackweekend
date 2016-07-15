var express = require('express');
var router = express.Router();
var searchStays = require("./search_stays");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/stays', function(req, res, next) {
    searchStays.getUserHotels(req, res);
});

module.exports = router;
