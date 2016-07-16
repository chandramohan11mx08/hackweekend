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

function createMarkerForStays(place, stayDetails) {
    var marker = new google.maps.Marker({
        map: map,
        position: place
    });

    google.maps.event.addListener(marker, 'click', function () {
        console.log('here is the stay', stayDetails);
        var imgUrl = null;
        var stayDescription = '';
        if (stayDetails.description) {
            stayDescription = stayDetails.description;
        }
        if (stayDetails.images && stayDetails.images.length) {
            imgUrl = '//stay-imgs.stayzilla.com/resize/75x75/' + stayDetails.sz_id + '/' + stayDetails.images[0].sz_id + '.' + stayDetails.images[0].ext;
        } else {
            imgUrl = '//stay-imgs.stayzilla.com/resize/400x300/110876/980596.jpg';
        }
        var contentString = '<div class="marker-toolTip">' +
            '<div class="stay-image">'+
            '<img class="image" src=' + imgUrl + '/>' +
            '</div>' +
            '<div class="stay-info">' +
            '<div class="stay-name">' + stayDetails.fld_name +'</div>' +
            '<div class="stay-price">Rs ' + stayDetails.base_price + '</div>' +
            '<div class="stay-link js-stay-link">link</div>' +
            '</div>' +
            '</div>';
        infowindow = new google.maps.InfoWindow({content: contentString});
        infowindow.open(map, this);

        google.maps.event.addDomListener(infowindow, 'domready', function() {
            $('.js-stay-link').click(function() {
                $('.js_route_sec').hide();
                $('.js_property_sec').html('');
                $('.js_property_sec').append(
                '<div class="property-page">' +
                    '<div class="property-name">' + stayDetails.fld_name +'</div>' +
                    '<div class="property-image">' +
                    '<img class="" src=' + imgUrl + '/>' +
                    + '</div>' +
                    '<div class="property-description">' + stayDescription + '</div>' +
                    '<div class="property-inventory">' + '</div>' +
                    '<div class="book-now">' + '</div>' +
                    '</div>'
                );
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