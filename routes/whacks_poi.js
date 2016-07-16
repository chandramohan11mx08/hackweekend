var request = require('request');
var async = require('async');
var searchPois = require('./search_poi');


var findPoisFromLegs = function (req, res) {
    var pois = [];
    var params = [];

    var legs = req.body.legs;
    for (var leg in legs) {
        var steps = legs[leg].steps;
        for (var step in steps) {
            var end_location = steps[step].end_location;
            var lat = end_location.lat;
            var lng = end_location.lng;
            params.push({lat: lat, lng: lng});
        }
    }

    async.forEachOf(params, function (value, key, callback) {
        var lat = params[key].lat;
        var lng = params[key].lng;
        searchPois.findPois(lat, lng, 200, function (err, response) {
            if (!err) {
                pois.push(response.hits.hits);
                callback();
            }
        });
    }, function (err) {
        if (err) {
            console.error(err.message);
        } else {
            res.send(200, {"pois": pois});
        }
    })
};

exports.findPoisFromLegs = findPoisFromLegs;
