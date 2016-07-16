var esClientHandler = require('./es_client');

var findStateWisePois  = function (state, callback) {
    var client = esClientHandler.get();
    client.search({
        index: 'search',
        type: 'szpoi',
        requestTimeout: 50000000,
        body: {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                state: state
                            }
                        }
                    ]
                }
            }
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
var getStateWisePois = function (req, res) {
    var state = req.state;
    findStateWisePois(state, function (err, response) {
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

exports.getStateWisePois = getStateWisePois;
