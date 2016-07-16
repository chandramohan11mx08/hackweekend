var map;
var infowindow;

function initMap() {
    var pyrmont = {
        lat: 14.6649575,
        lng: 77.5591867
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();
}

function createMarkerForStays(place, name) {
    var marker = new google.maps.Marker({
        map: map,
        position: place
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(name);
        infowindow.open(map, this);
    });
}

function initMapRedirect(origin, destination) {
    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    // Set destination, origin and travel mode.
    var request = {
        destination: destination,
        origin: origin,
        travelMode: google.maps.TravelMode.DRIVING
    };

    // Pass the directions request to the directions service.
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            // Display the route on the map.
            directionsDisplay.setDirections(response);
        }
    });

}