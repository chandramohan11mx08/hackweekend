var request = require('request');
var async = require('async');
var searchStays = require('./search_stays');
var polyline = require('polyline');

var findStaysFromLegs = function (req, res) {
    var stays = [];
    var params = [];
    var totalDistance = 0;
    var legs = req.body.legs;
    for (var legIndex in legs) {
        var leg = legs[legIndex];
        var steps = leg.steps;
        for (var index in steps) {
            var step = steps[index];
            var distance = step.distance.value;
            totalDistance = totalDistance + distance;
            console.log("dist so far: " + totalDistance);

            if (totalDistance > 100000) {
                console.log("dist so far inside proceed" + totalDistance);
                if (distance > 20000) {
                    var polylineEncoded = step.polyline.points;
                    var latLngss = polyline.decode(polylineEncoded);
                    var length = latLngss.length;
                    var midpoint = Math.ceil(length / 2);
                    var midpoint2 = midpoint;

                    var latLng = latLngss[midpoint];
                    params.push({lat: latLng[0], lng: latLng[1]});
                    while (midpoint > 1) {
                        midpoint = Math.ceil(midpoint / 2);
                        var latLng = latLngss[midpoint];
                        params.push({lat: latLng[0], lng: latLng[1]});
                    }


                    var midpointInc = Math.ceil((midpoint2 + length) / 2);
                    var latLng1 = latLngss[midpointInc];
                    params.push({lat: latLng1[0], lng: latLng1[1]});
                    while (midpointInc < (length - 1)) {
                        midpointInc = Math.ceil((midpointInc + length) / 2);
                        var latLng = latLngss[midpointInc];
                        params.push({lat: latLng[0], lng: latLng[1]});
                    }
                }

                var end_location = step.end_location;
                var lat = end_location.lat;
                var lng = end_location.lng;
                params.push({lat: lat, lng: lng});
            }
        }
    }

    async.forEachOf(params, function (value, key, callback) {
        var lat = params[key].lat;
        var lng = params[key].lng;
        var radius = 5;
        if (key == (params.length - 1)) {
            radius = 30;
        }
        searchStays.findStays(lat, lng, radius, function (err, response) {
            if (!err) {
                if (response.hits.hits.length > 0) {
                    stays.push(response.hits.hits);
                }
                callback();
            }
        });
    }, function (err) {
        if (err) {
            console.error(err.message);
        } else {
            res.send(200, {"stays": stays});
        }
    })
};

var findPoiFromStays = function (req, res) {
    var poiResponseArray = [];
    var params = [];

    var stays = req.body.stays;
    for (var stayIndex in stays) {
        var staysArrayInLocation = stays[stayIndex];
        for (var staysInLocationIndex in staysArrayInLocation) {
            var stay = staysArrayInLocation[staysInLocationIndex];
            var szid = stay._source.sz_id;
            params.push({szid: szid, location: stay._source.location});
        }
    }

    async.forEachOf(params, function (value, key, callback) {

        var location = params[key].location;
        var types = "gas_station|cafe|night_club|hindu_temple";
        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + location + "&radius=5000&key=AIzaSyBz0QZLgUyySO2mWAy5KcOHFXMpWkGYPOA&types=";

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                poiResponseArray.push(JSON.parse(response.body));
            }
            callback();
        });
    }, function (err) {
        if (err) {
            res.send(500);
        } else {
            res.send(200, {"poi": poiResponseArray});
        }
    })
};

var findRoute = function (req, res) {

    var baseUrl = "https://maps.googleapis.com/maps/api/directions/json";
    var API_KEY = "AIzaSyBz0QZLgUyySO2mWAy5KcOHFXMpWkGYPOA";

    var origin_place_id = req.query.origin;
    var destination_place_id = req.query.destination;

    request(baseUrl + '?origin=place_id:' + origin_place_id + '&destination=place_id:' + destination_place_id + '&key=' + API_KEY, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(JSON.parse(response.body));
        } else {
            res.send(500);
        }
    });
};

exports.findStaysFromLegs = findStaysFromLegs;
exports.findRoute = findRoute;
exports.findPoiFromStays = findPoiFromStays;