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

function splitDescription(description) {
    var descriptionObj = {};
    var noOfLettersToShow = 300;

    if (description) {
        description = description.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        description = description.replace(/(?:<br[^>]*>\s*){2,}/g, '<br/><br/>');

        if (description.length > noOfLettersToShow) {
            descriptionObj.textToShow = description.slice(0, noOfLettersToShow);
            descriptionObj.extraDescription = description.slice(noOfLettersToShow, description.length);
        } else {
            descriptionObj.textToShow = description;
            descriptionObj.extraDescription = '';
        }
    }

    return descriptionObj;
}

function createMarkerForFamousLocations(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarkerForFamousLocations(results[i]);
        }
    }
    createMarkerForStays()
}

function createMarkerForSingleStay(place, name) {
    var marker = new google.maps.Marker({
        map: map,
        lat: place.lat,
        lng: place.lng,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });
}

function createMarkerForStays(place, stayDetails, routes) {
    var marker = new google.maps.Marker({
        map: map,
        position: place,
        icon: '/image/hotel_marker_icon.png'
    });

    google.maps.event.addListener(marker, 'click', function () {
        var imgUrl = null;
        var stayDescription = splitDescription(stayDetails.description);
        if (stayDetails.images && stayDetails.images.length) {
            imgUrl = '//stay-imgs.stayzilla.com/resize/400x400/' + stayDetails.sz_id + '/' + stayDetails.images[0].sz_id + '.' + stayDetails.images[0].ext;
        } else {
            imgUrl = '//stay-imgs.stayzilla.com/resize/400x400/110876/980596.jpg';
        }
        var contentString = '<div class="marker-toolTip">' +
            '<div class="stay-image">' +
            '<img class="image" src=' + imgUrl + '/>' +
            '</div>' +
            '<div class="stay-info">' +
            '<div class="stay-name">' + stayDetails.fld_name + '</div>' +
            '<div class="stay-price">Rs ' + stayDetails.base_price +
                '<button class="add-btn">Add</button>' +
            '</div>' +
            '<div class="stay-link js-stay-link">More details</div>' +
            '</div>' +
            '</div>';
        infowindow = new google.maps.InfoWindow({content: contentString});
        infowindow.open(map, this);

        google.maps.event.addDomListener(infowindow, 'domready', function () {
            $('.js-stay-link').click(function () {
                $('.js_route_sec').hide();
                $('.js_property_sec').html('');
                $('.js_property_sec').append(
                    '<div class="property-page">' +
                    '<div class="property-name route_label">' + stayDetails.fld_name + '</div>' +
                    '<div class="property-image-wrapper">' +
                    '<img class="property-image" src=' + imgUrl + '/>' + '</div>' +
                    '<div class="property-description">' + stayDescription.textToShow + '... </div>' +
                    '<div class="property-inventory">' + '</div>' +
                    '<div class="book-now route_label">' +
                    '<button class="bookNow"> Book Now'
                    + '</button>' +
                    '</div>' +
                    '</div>'
                );

                $('.bookNow').on('click', function () {
                    var location = stayDetails.location.split(',');
                    var pyrmont = {
                        lat: parseFloat(location[0]),
                        lng: parseFloat(location[1])
                    };

                    infowindow = new google.maps.InfoWindow();
                    var service = new google.maps.places.PlacesService(map);
                    service.nearbySearch({
                        location: pyrmont,
                        radius: 50000,
                        rating: 4,
                        types: ['hindu_temple'],
                        rankby: 'prominence'
                    }, callback);
                    createMarkerForSingleStay(place, stayDetails.fld_name);
                });
            });

            $('.add-btn').on('click', function () {
                var location = stayDetails.location.split(',');
                var wayPoints =
                [{
                    location:new google.maps.LatLng(location[0], location[1]),
                    stopover:false
                }];

                var directionsDisplay = new google.maps.DirectionsRenderer({
                    map: map
                });

                // Set destination, origin and travel mode.
                var request = {
                    destination: routes[0].legs[0].end_location,
                    origin: routes[0].legs[0].start_location,
                    waypoints: wayPoints,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                console.log('sjhad', request);

                // Pass the directions request to the directions service.
                var directionsService = new google  .maps.DirectionsService();
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        // Display the route on the map.
                        console.log('hey', response);
                        directionsDisplay.setDirections(response);
                    }
                });
            });
        });
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