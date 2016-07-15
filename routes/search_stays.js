var esClientHandler = require('./es_client');

var userHotels = function (client, res) {
    client.get({
        index: 'suggest',
        type: 'szlist',
        requestTimeout: 50000000,
        body: {
            "filtered": {
                "query": {
                    "match_all": {}
                },
                "filter": {
                    "geo_distance_range": {
                        "from": "0km",
                        "to": "30km",
                        "location": {
                            "lat": 12.97194,
                            "lon": 77.59369
                        }
                    }
                }
            }
        }
    }, function (error, response) {
        if (error) {
            console.log(error);
//            callback(false, []);
            res.send(500);
        }
        else if (response.found === true) {
            console.dir(response);
            res.send(200);
        }
    });
    return;
};
var getUserHotels = function (req, res) {
    var esClient = esClientHandler.get();
//    var hotelQuery = req.query;
    userHotels(esClient, res);
};
exports.getUserHotels = getUserHotels;