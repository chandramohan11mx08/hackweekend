var express = require('express');
var router = express.Router();
var searchStays = require("./search_stays");
var whacks = require("./whacks");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET search page. */
router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Search Stays' });
});

router.get('/route', function(req, res, next) {
    whacks.findRoute(req, res);
});

router.get('/route/stays', function(req, res, next) {
    whacks.findStaysInRoute(req, res);
});

router.get('/stays', function(req, res, next) {
    searchStays.getUserHotels(req, res);
});

router.post('/stays/legs', function(req, res, next) {
    whacks.findStaysFromLegs(req, res);
});


module.exports = router;
