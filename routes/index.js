var express = require('express');
var router = express.Router();
var searchStays = require("./search_stays");
var whacks = require("./whacks");
var searchPois = require('./search_poi');

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

router.get('/stays', function(req, res, next) {
    searchStays.getUserHotels(req, res);
});

router.post('/stays/legs', function(req, res, next) {
    whacks.findStaysFromLegs(req, res);
});

router.get('/pois', function (req, res, next) {
    searchPois.getUserPois(req,res);
});

router.post('/stays/legs', function(req, res, next) {
    whacks.findPoisFromLegs(req, res);
});

module.exports = router;
