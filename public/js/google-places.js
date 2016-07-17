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
    var image = {
        url: '/image/hotel_places_marker_icon.png',
        size: new google.maps.Size(71, 135),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 32),
        scaledSize: new google.maps.Size(25, 48)
    };
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        zoom: 14,
        position: place.geometry.location,
        icon: image,
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'click', function () {
        if (infowindow) {
            infowindow.close();
        }
        infowindow.setContent(place.name);
        infowindow.open(map, this);
        $.ajax({
            url: '/stays?lat='+ place.geometry.location.lat() + '&lng=' + place.geometry.location.lng() + '&radius=15',
            type: 'GET',
            dataTYpe: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (body) {
                var res = body;
                $.each(body.stays, function (i, obj) {
                    if (Object.keys(obj).length) {
                            var ltArr = obj._source.location.split(',');
                            var object = {
                                lat: parseFloat(ltArr[0]),
                                lng: parseFloat(ltArr[1])
                            };
                            createMarkerForStays(object, obj._source, res.routes);
                    }
                });
        }
    });
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
    var image = {
        url: '/image/hotel_selected_marker_icon.png',
        size: new google.maps.Size(71, 135),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 32),
        scaledSize: new google.maps.Size(25, 48)
    };
    var marker = new google.maps.Marker({
        map: map,
        lat: place.lat,
        lng: place.lng,
        icon: image
    });
    var myLatlng = new google.maps.LatLng(place.lat, place.lng);
    map.setCenter(myLatlng);
    map.setZoom(13);
}

function createMarker(place, name) {
    var image = {
        url: '/image/hotel_places_marker_icon.png',
        size: new google.maps.Size(71, 135),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 32),
        scaledSize: new google.maps.Size(25, 48)
    };
    var marker = new google.maps.Marker({
        map: map,
        position: place,
        animation: google.maps.Animation.DROP,
        icon: image
    });
    google.maps.event.addListener(marker, 'click', function () {
        if (infowindow) {
            infowindow.close();
        }
        infowindow.setContent(name);
        infowindow.open(map, this);
        $.ajax({
            url: '/stays?lat=' + place.lat + '&lng=' + place.lng + '&radius=15',
            type: 'GET',
            dataTYpe: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (body) {
                var res = body;
                $.each(body.stays, function (i, obj) {
                    if (Object.keys(obj).length) {
                        var ltArr = obj._source.location.split(',');
                        var object = {
                            lat: parseFloat(ltArr[0]),
                            lng: parseFloat(ltArr[1])
                        };
                        createMarkerForStays(object, obj._source, res.routes);
                    }
                });
            }
        });
    });
    var myLatlng = new google.maps.LatLng(place.lat, place.lng);
    map.setCenter(myLatlng);
    map.setZoom(8);
}

function createMarkerForStays(place, stayDetails, routes) {
    var image = {
        url: '/image/hotel_marker_icon.png',
        size: new google.maps.Size(71, 135),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 32),
        scaledSize: new google.maps.Size(25, 48)
    };
    var marker = new google.maps.Marker({
        map: map,
        position: place,
        animation: google.maps.Animation.DROP,
        icon: image
    });

    google.maps.event.addListener(marker, 'click', function () {
        var imgUrl = null;
        var stayDescription = splitDescription(stayDetails.description);
        if (stayDetails.images && stayDetails.images.length) {
            imgUrl = '//stay-imgs.stayzilla.com/resize/400x400/' + stayDetails.sz_id + '/' + stayDetails.images[0].sz_id + '.' + stayDetails.images[0].ext;
        } else {
            imgUrl = '//stay-imgs.stayzilla.com/resize/400x400/110876/980596.jpg';
        }
        var contentString = '<div class="marker-toolTip" data-type="stay">' +
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
        if (infowindow) {
            infowindow.close();
        }
        infowindow = new google.maps.InfoWindow({content: contentString});
        infowindow.open(map, this);

        google.maps.event.addDomListener(infowindow, 'domready', function () {
            $('.js-stay-link').click(function () {
                $('.js_route_sec').hide();
                $('.js_property_page_cont').html('').show();
                $('.js_property_page_cont').append(
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
                    $('.js_property_page_cont').hide();
                    var html = '<div class="route_marker"><div class="route_marker_label_cont">' +
                        '<div class="route_marker_label" style="border: 0;">' +
                        '<img src="'+imgUrl+'" style="    width: 80px;    height: 80px;    border-radius: 50px;">' +
                        '<div class="timing" style="border: 1px solid #ddd;padding: 3px 10px;margin: 10px 0 0 0;">' +
                        ''+stayDetails.fld_name+'</div></div></div></div>';
                    $('.js_route_sec').show();
                    $('.js_route_sec .route_label').eq(0).after(html);
                    if (infowindow) {
                        infowindow.close();
                    }
                    infowindow = new google.maps.InfoWindow();
                    var service = new google.maps.places.PlacesService(map);
                    service.nearbySearch({
                        location: pyrmont,
                        radius: 25000,
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
                    stopover: true
                }];

                $('.js_route_sec').show();
                $('.js_property_page_cont').hide();

                var directionsDisplay = new google.maps.DirectionsRenderer({
                    map: map
                });

                // Set destination, origin and travel mode.
                var request = {
                    destination: routes[0].legs[0].end_location,
                    origin: routes[0].legs[0].start_location,
                    waypoints: wayPoints,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                // Pass the directions request to the directions service.
                var directionsService = new google  .maps.DirectionsService();
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        // Display the route on the map.
                        var legsString = '';
                        for (var j=0; j < response.routes[0].legs.length; j++) {
                           legsString = legsString + '<div class="route_label">' + response.routes[0].legs[j].start_address + '</div><div class="route_marker"><div class="route_marker_label_cont">' +
                               '<div class="route_marker_label"><div class="dist">' + response.routes[0].legs[j].distance.text + '</div>' +
                               '<div class="timing">' + response.routes[0].legs[j].duration.text + '</div></div></div></div>';

                            if (j === response.routes[0].legs.length - 1) {
                                legsString = legsString + '<div class="route_label">' + response.routes[0].legs[j].end_address + '</div>'
                            }
                        }
                        directionsDisplay.setDirections(response);
                        $('.js_route_sec').html('');
                        $('.js_route_sec').append(legsString);
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