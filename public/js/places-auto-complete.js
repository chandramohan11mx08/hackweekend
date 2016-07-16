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
    $.ajax({
        url: '/route?origin=' + fromPlaceId + '&destination=' + toPlaceId,
        success: function (body) {
            var res = body;
            console.log(res.routes[0].legs[0].start_address);
            console.log(res.routes[0].legs[0].end_address);
            $.ajax({
                url: '/stays/legs',
                type: 'POST',
                data: JSON.stringify({legs: res.routes[0].legs}),
                dataTYpe: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (body) {
                    console.log(body);
                }
            });

        }
    });
}

function collectPlaceFrom() {
    // Get the place details from the autocomplete object.
    var place = startingFrom.getPlace();
    console.log(place.place_id);
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