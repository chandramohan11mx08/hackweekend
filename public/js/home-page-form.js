
$(document).ready(function () {

    var is_bouncy_nav_animating = false;

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

    $('.js_road_trip').on('click', function () {
        $('.interest_opt_img_cont').removeClass('active');
        $(this).find('.interest_opt_img_cont').addClass('active');
        $('.js_pilgrimage_trip_form').addClass('hide');
        $('.js_road_trip_form').removeClass('hide');
        $('.js_form_next').trigger('click');
        $('.holidays_nav_sec').removeClass('hide');
    });

    $('.js_pilgrimage_trip').on('click', function () {
        $('.interest_opt_img_cont').removeClass('active');
        $(this).find('.interest_opt_img_cont').addClass('active');
        $('.js_pilgrimage_trip_form').removeClass('hide');
        $('.js_road_trip_form').addClass('hide');
        $('.js_form_next').trigger('click');
        $('.holidays_nav_sec').removeClass('hide');
    });

    $('.js_form_next').on('click', function () {
        var currIndex = Number($('.js_form_nav').data('curr-index'));
        var nextIndex = currIndex + 1;
        $('.js_form_nav').data('curr-index', nextIndex);
        $('.pagination [data-index="' + nextIndex + '"]').parent().trigger('click');
        if (nextIndex === 2) {
            $('.js_form_next').addClass('hide');
            triggerBouncyNav(true);
        }else {
            $('.js_form_next').removeClass('hide');
        }
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

            if (prevIndex === 2) {
                $('.js_form_next').addClass('hide');
                triggerBouncyNav(true);
            }else{
                $('.js_form_next').removeClass('hide');
            }
        }
    });

    //Select City
    function showFormLoader() {
        $('.js_city_list').html('loading');
        $('.js_city_list').html('<li><a href="#0" class="js_select_city">Kali</a></li>' +
            '<li><a href="#0" class="js_select_city">Krishna</a></li>' +
            '<li><a href="#0" class="js_select_city">God</a></li>' +
            '<li><a href="#0" class="js_select_city">Dodd</a></li>' +
            '<li><a href="#0" class="js_select_city">Ram</a></li>' +
            '<li><a href="#0" class="js_select_city">Seethe</a></li>');
        $('.cd-bouncy-nav-modal').removeClass('fade-out').addClass('fade-in');
    }

    function bindSelectOptionsEvents() {
        $('.js_select_city').on('click', function () {
            triggerBouncyNav(false);
            showFormLoader();
            $('.js_options_close').removeClass('hide');
            $('.js_form_back').addClass('hide');
        });
    }

    bindSelectOptionsEvents();

    $('.js_options_close').on('click', function () {
        triggerBouncyNav(false);
        var html = '<li> <a href="#0" class="js_select_city">Bangalore</a> </li> <li> <a href="#0" class="js_select_city">Goa</a> </li> <li> <a href="#0" class="js_select_city">Mumbai</a> </li> <li> <a href="#0" class="js_select_city">Delhi</a> </li> <li> <a href="#0" class="js_select_city">Kolkata</a> </li> <li> <a href="#0" class="js_select_city">Chennai</a> </li>';
        $('.js_city_list').html(html);
        $('.cd-bouncy-nav-modal').removeClass('fade-out').addClass('fade-in');
        $('.js_options_close').addClass('hide');
        $('.js_form_back').removeClass('hide');
        bindSelectOptionsEvents();
    });
    
    
});