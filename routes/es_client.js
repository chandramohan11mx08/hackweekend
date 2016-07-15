var elasticsearch = require('elasticsearch');
var client = function () {
    return new elasticsearch.Client({
        host: "sagar_u.rbahn.com",
        keepAlive: false
    });
};

exports.get = client;