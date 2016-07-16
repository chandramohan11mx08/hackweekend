var elasticsearch = require('elasticsearch');
var client = function () {
    return new elasticsearch.Client({
        host: "52.66.74.233:9200",
        keepAlive: false
    });
};

exports.get = client;