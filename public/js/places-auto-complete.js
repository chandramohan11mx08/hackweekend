var placeSearch, startingFrom, goingTo;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};
var fromPlaceId = '';
var toPlaceId = '';

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    startingFrom = new google.maps.places.Autocomplete((document.getElementById('startingFrom')), {types: ['geocode']});
    goingTo = new google.maps.places.Autocomplete((document.getElementById('goingTo')), {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    startingFrom.addListener('place_changed', collectPlaceFrom);
    goingTo.addListener('place_changed', collectPlaceTo);
}

function collectPlaceTo() {
    var place = goingTo.getPlace();
    console.log(place.place_id);
    toPlaceId = place.place_id;
    $('.js_map_loader').removeClass('hide');
    $.ajax({
        url: '/route?origin=' + fromPlaceId + '&destination=' + toPlaceId,
        success: function (body) {
            var res = body;
            console.log(res.routes[0].legs[0].start_address);
            console.log(res.routes[0].legs[0].end_address);
            $('.js_route_sec').show();
            $('.js_route_sec').html('');
            $('.js_route_sec').append('<div class="route_label">' + res.routes[0].legs[0].start_address + '</div>');
            $('.js_route_sec').append('<div class="route_marker"><div class="route_marker_label_cont">' +
                '<div class="route_marker_label"><div class="dist">' + res.routes[0].legs[0].distance.text + '</div>' +
                '<div class="timing">' + res.routes[0].legs[0].duration.text + '</div></div></div></div>');
            $('.js_route_sec').append('<div class="route_label">' + res.routes[0].legs[0].end_address + '</div>');
            $.ajax({
                url: '/stays/legs',
                type: 'POST',
                data: JSON.stringify({legs: res.routes[0].legs}),
                dataTYpe: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (body) {
                    $('.cd-user-modal').addClass('is-visible');
                    $('.js_map_loader').addClass('hide');
                    initMap();
                    initMapRedirect(res.routes[0].legs[0].start_location, res.routes[0].legs[0].end_location);
                    $.each(body.stays, function (i, obj) {
                        if (obj.length) {
                            $.each(obj, function (j, val) {
                                var ltArr = val._source.location.split(',');
                                var obj = {
                                    lat: parseFloat(ltArr[0]),
                                    lng: parseFloat(ltArr[1])
                                };
                                createMarkerForStays(obj, val._source, res.routes);
                            });
                        }
                    });
                    $.ajax({
                        url: '/pois/legs',
                        type: 'POST',
                        data: JSON.stringify({legs: res.routes[0].legs}),
                        dataTYpe: 'json',
                        contentType: "application/json; charset=utf-8",
                        success: function (body) {
                            $.each(body.pois, function (i, obj) {
                                if (obj.length) {
                                    $.each(obj, function (j, val) {
                                        var ltArr = val._source.geometry.location;

                                        var obj = {
                                            lat: parseFloat(ltArr.lat),
                                            lng: parseFloat(JSON.parse(JSON.stringify(ltArr.lon)))
                                        };
                                        createMarkerForSingleStay(obj, val._source.name);
                                    });
                                }

                            });
                        }
                    });
                }
            });

        }
    });
}

function collectPlaceFrom() {
    // Get the place details from the autocomplete object.
    var place = startingFrom.getPlace();
    fromPlaceId = place.place_id;
    // Get each component of the address from the place details
    // and fill the corresponding field on the form.

    // var origin_place_id = "ChIJbU60yXAWrjsR4E9-UejD3_g";
    // var destination_place_id = "ChIJj0i_N0xaozsRZP78dHq8e4I";

}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            startingFrom.setBounds(circle.getBounds());
            goingTo.setBounds(circle.getBounds());
        });
    }
}