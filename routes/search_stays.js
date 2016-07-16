var esClientHandler = require('./es_client');

var findStays = function (lat, lng, radius, callback) {
    var esClient = esClientHandler.get();
    esClient.search({
        index: 'search',
        type: 'szlist',
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
                            location: {
                                lat: lat,
                                lon: lng
                            }
                        }
                    }
                }
            },
            size:10
        }
    }, function (error, response) {
        callback(error, response);
    });
};

var getUserHotels = function (req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var radius = req.query.radius;

    findStays(lat, lng, radius, function (err, response) {
        if (err) {
            res.send(500, {error: err.message});
        }
        else {
            res.send(200, {
                "stays": response.hits.hits
            })
        }
    });
};

exports.findStays = findStays;
exports.getUserHotels = getUserHotels;