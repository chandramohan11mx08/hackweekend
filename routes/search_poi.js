var esClientHandler = require('./es_client');

var findPois  = function (lat, lng, radius, callback) {
    var client = esClientHandler.get();
    client.search({
        index: 'search',
        type: 'szpoi',
        requestTimeout: 50000000,
        body: {
            query: {
                filtered: {
                    query: {
                        match_all: {}
                    },
                    filter: {
                        geo_distance_range: {
                            from: "0km",
                            to: "5km",
                            location : {
                                lat: lat,
                                lon: lng
                            }
                        }
                    }
                }
            },
            size : 10
        }
    }, function (error, response) {
        if (error) {
            console.log(error);
            callback(error, []);
        }
        else {
            console.dir(response);
            callback(null, response);
        }
    });
    return;
};
var getUserPois = function (req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var radius = req.query.radius;

    findPois(lat, lng, radius, function (err, response) {
        if (err) {
            res.send(500, {error: err.message});
        }
        else {
            res.send(200, {
                "pois": response.hits.hits
            })
        }
    });
};

exports.getUserPois = getUserPois;
exports.findPois = findPois;