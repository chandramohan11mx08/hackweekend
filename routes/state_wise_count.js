var esClientHandler = require('./es_client');

var findStateWiseCount  = function (callback) {
    var client = esClientHandler.get();
    client.search({
        index: 'search',
        type: 'szpoi',
        requestTimeout: 50000000,
        body: {
            query: {
                match_all: {}
            },
            aggregations : {
                state : {
                    terms : {
                        field : "state.raw",
                        size : 1000
                    }
                }
            },
            size: 200
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
var getStateWiseCount = function (req, res) {

    findStateWiseCount(function (err, response) {
        if (err) {
            res.send(500, {error: err.message});
        }
        else {
            res.send(200, {
                "pois": response.hits.hits,
                "aggregations" : response.aggregations.state.buckets
            })
        }
    });
};

exports.getStateWiseCount = getStateWiseCount;
