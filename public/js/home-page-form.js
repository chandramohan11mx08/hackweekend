$(document).ready(function () {

    var is_bouncy_nav_animating = false;
    var list_of_state = [];
    var selected_state_temples = [];

    function triggerBouncyNav($bool) {
        //check if no nav animation is ongoing
        if (!is_bouncy_nav_animating) {
            is_bouncy_nav_animating = true;

            //toggle list items animation
            $('.cd-bouncy-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                $('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
                if (!$bool) $('.cd-bouncy-nav-modal').removeClass('fade-out');
                is_bouncy_nav_animating = false;
            });

            //check if CSS animations are supported...
            if ($('.cd-bouncy-nav-trigger').parents('.no-csstransitions').length > 0) {
                $('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
                is_bouncy_nav_animating = false;
            }
        }
    }

    function state_list_events() {
        $('.js_state_name').on('click', function () {
            var state = $(this).data('state-name');
            triggerBouncyNav(false);
            $('.js_options_close').removeClass('hide');
            $('.js_form_back').addClass('hide');
            showFormLoader();
            $.ajax({
                url: '/statepois',
                type: 'POST',
                data: JSON.stringify({state: state}),
                dataTYpe: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (body) {
                    console.log(body);
                    $('.js_city_list').html('');
                    selected_state_temples = body.pois;
                    $.each(selected_state_temples, function (i, obj) {
                        if (obj._source.name) {
                            $('.js_city_list').append('<li data-state-name="' + obj._source.name + '">' +
                                '<img src="/image/temple_default.jpg" style="width: 90px;height: 90px;border-radius: 50px;"/>' +
                                '<a href="#0" class="js_select_city">' + obj._source.name + '</a></li>');
                        }
                    });
                    $('.cd-bouncy-nav-modal').removeClass('fade-out').addClass('fade-in');
                }
            });
        });
    }

    function addStateOptList(list_of_state) {
        $('.js_city_list').html('');
        $.each(list_of_state, function (i, obj) {
            if (obj.key) {
                var keyWoSp = obj.key.replace(/ /g, '_');
                $('.js_city_list').append('<li data-state-name="' + obj.key + '" class="js_state_name">' +
                    '<img src="/image/state/' + keyWoSp + '.jpeg" style="width: 90px;height: 90px;border-radius: 50px;"/>' +
                    '<a href="#0" class="js_select_city">' + obj.key + ' <br/> ' +
                    '<span class="temple_hep_text">' + obj.doc_count + ' temples found</span></a></li>');
            }
        });
        state_list_events();
    }

    $('.js_road_trip').on('click', function () {
        $('.interest_opt_img_cont').removeClass('active');
        $(this).find('.interest_opt_img_cont').addClass('active');
        $('.js_pilgrimage_trip_form').addClass('hide');
        $('.js_road_trip_form').removeClass('hide');
        $('.js_form_nav').data('curr-index', 1);
        $('.pagination [data-index="2"]').parent().trigger('click');
        $('.js_form_next').addClass('hide');
        $('.holidays_nav_sec').removeClass('hide');
    });

    $('.js_pilgrimage_trip').on('click', function () {
        $('.interest_opt_img_cont').removeClass('active');
        $(this).find('.interest_opt_img_cont').addClass('active');
        $('.js_pilgrimage_trip_form').removeClass('hide');
        $('.js_road_trip_form').addClass('hide');
        $('.js_form_nav').data('curr-index', 1);
        $('.pagination [data-index="1"]').parent().trigger('click');
        $('.js_form_next').addClass('hide');
        triggerBouncyNav(true);
        $('.holidays_nav_sec').removeClass('hide');
    });

    $('.js_form_next').on('click', function () {
        var currIndex = Number($('.js_form_nav').data('curr-index'));
        var nextIndex = currIndex + 1;
        $('.js_form_nav').data('curr-index', nextIndex);
        $('.pagination [data-index="' + nextIndex + '"]').parent().trigger('click');
        $('.js_form_next').removeClass('hide');
    });

    $('.js_form_back').on('click', function () {
        var currIndex = Number($('.js_form_nav').data('curr-index'));
        var prevIndex = currIndex - 1;
        if (prevIndex === 0) {
            $('.holidays_nav_sec').addClass('hide');
        }
        if (currIndex > 0) {
            $('.pagination [data-index="' + prevIndex + '"]').parent().trigger('click');

            $('.js_form_nav').data('curr-index', prevIndex);

            if (prevIndex === 1) {
                $('.js_form_next').addClass('hide');
                triggerBouncyNav(true);
            } else {
                $('.js_form_next').removeClass('hide');
            }
        }
    });

    //Select City
    function showFormLoader() {
        $('.js_city_list').html('loading');
    }

    $('.js_options_close').on('click', function () {
        triggerBouncyNav(false);
        $('.cd-bouncy-nav-modal').removeClass('fade-out').addClass('fade-in');
        $('.js_options_close').addClass('hide');
        $('.js_form_back').removeClass('hide');
        addStateOptList(list_of_state);
    });

    $.ajax({
        url: '/statecount',
        type: 'GET',
        success: function (body) {
            console.log(body.aggregations);
            list_of_state = body.aggregations;
            addStateOptList(list_of_state);
        }
    });

    $('.js_close_popup').on('click', function () {
        $('#goingTo').val('');
        $('.cd-user-modal').removeClass('is-visible');
    });


});

