var express = require('express');
var router = express.Router();
var searchStays = require("./search_stays");
<<<<<<< 2f4abef4e67ff94308d9bda9e85d0e29ceb7539d
var whacks = require("./whacks");
=======
var searchPois = require('./search_poi');
>>>>>>> added poi-search api

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

router.get('/poi', function (req, res, next) {
    searchPois.getUserPoi(req,res);
});

module.exports = router;
