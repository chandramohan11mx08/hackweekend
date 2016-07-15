var request = require('request');
var async = require('async');


findStaysFromLegs = function () {

    var places = [];

    var baseUrl = "https://maps.googleapis.com/maps/api/directions/json";
    var API_KEY = "AIzaSyCV4F7s1JuDChWLGFG-2S5rmSbdGnOM2CI";


    var request1 = function(){
        var origin_place_id = "ChIJbU60yXAWrjsR4E9-UejD3_g";
        var destination_place_id = "ChIJj0i_N0xaozsRZP78dHq8e4I";
        request(baseUrl + '?origin=place_id:' + origin_place_id + '&destination=place_id:' + destination_place_id + '&key=' + API_KEY, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var res = JSON.parse(body);
                console.log(res.routes[0].legs[0].start_address);
                console.log(res.routes[0].legs[0].end_address);
//                places.push(res.routes[0].legs[0].start_address);
//                places.push(res.routes[0].legs[0].end_address);
//                console.log("After req 1");
//                console.dir(places);
            }
        });
    }


    var request2 = function(){
        var origin_place_id = "ChIJj0i_N0xaozsRZP78dHq8e4I";
        var destination_place_id = "ChIJQbc2YxC6vzsRkkDzYv-H-Oo";
        request(baseUrl + '?origin=place_id:' + origin_place_id + '&destination=place_id:' + destination_place_id + '&key=' + API_KEY, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var res = JSON.parse(body);
                console.log(res.routes[0].legs[0].start_address);
                console.log(res.routes[0].legs[0].end_address);
//                places.push(res.routes[0].legs[0].start_address);
//                places.push(res.routes[0].legs[0].end_address);
//                console.log("After req 2");
//                console.dir(places);
            }
        });
    }

//    request1();
//        request2();
    async.parallel([request1, request2], function (err, results) {
        if (err) {
            console.log("Something went wrong");
        } else {
            console.log("After both");
            console.dir(places);
            console.log(results);
        }
    });
};

//
//request(baseUrl + '?origin=place_id:' + origin_place_id + '&destination=place_id:' + destination_place_id + '&key=' + API_KEY, function (error, response, body) {
//    if (!error && response.statusCode == 200) {
//        var res = JSON.parse(body);
//        console.log(res.routes[0].legs[0].start_address);
//        console.log(res.routes[0].legs[0].end_address);
//    }
//});

findStaysFromLegs();
exports.shortenUrl = findStaysFromLegs;