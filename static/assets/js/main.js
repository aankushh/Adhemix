(function($){

	'use strict';

    // Check if element exists
    $.fn.elExists = function() {
        return this.length > 0;
    };

    // Global State Object
    var state = {};
    window.state = state;
    


	// Variables

	var $html = $('html'),
		$body = $('body'),
		$window = $(window),
		$pageUrl = window.location.href.substr(window.location.href.lastIndexOf("/") + 1),
		$overlay = $('.global-overlay'),
		$header = $('.header'),		
		$headerInner = $('.header__inner'),
		$headerPosition = ( $headerInner.elExists() ) ? $headerInner.offset().top : '',
		$mainHeaderHeight = ( $headerInner.elExists() ) ? $headerInner[0].getBoundingClientRect().height : 0,
		$headerTotalHeight = $headerPosition + $mainHeaderHeight,
		$fixedHeader = $('.header .header--fixed'),
		$dom = $('.wrapper').children(),
		$elementCarousel = $('.element-carousel'),
		$footer = $('.footer');

	/**********************
	*Background Color settings
	***********************/ 
	var $bgcolor = $('.bg-color');
	$bgcolor.each(function(){
		var $this = $(this),
			$color = $this.data('bg-color');
		$this.css('background-color', $color);
	});

	/**********************
	*Background Image settings
	***********************/ 

	var $bgimage = $('.bg-image');
	$bgimage.each(function(){
		var $this = $(this),
			$image = $this.data('bg-image');

		$this.css({
			'background-image': 'url(' + $image + ')'
		});
	});


	/**********************
	*Off Canvas Menu
	***********************/ 


    /*Variables*/
    var $offcanvasNav = $('.offcanvas-menu'),
        $offcanvasNavSubMenu = $offcanvasNav.find('.sub-menu');
    
    /*Add Toggle Button With Off Canvas Sub Menu*/
    $offcanvasNavSubMenu.parent().prepend('<span class="menu-expand"><i class="fa fa-angle-down"></i></span>');
    
    /*Close Off Canvas Sub Menu*/
    $offcanvasNavSubMenu.slideUp();
    
    /*Category Sub Menu Toggle*/
    $offcanvasNav.on('click', 'li a, li .menu-expand', function(e) {
        var $this = $(this);
        if ( ($this.parent().attr('class').match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/)) && ($this.attr('href') === '#' || $this.hasClass('menu-expand')) ) {
            e.preventDefault();
            if ($this.siblings('ul:visible').length){
                $this.siblings('ul').slideUp('slow');
            }else {
                $this.closest('li').siblings('li').find('ul:visible').slideUp('slow');
                $this.siblings('ul').slideDown('slow');
            }
        }
        if( $this.is('a') || $this.is('span') || $this.attr('clas').match(/\b(menu-expand)\b/) ){
        	$this.parent().toggleClass('menu-open');
        }else if( $this.is('li') && $this.attr('class').match(/\b('menu-item-has-children')\b/) ){
        	$this.toggleClass('menu-open');
        }
    });
	

	/**********************
	* Scroll To Top
	***********************/

	var scrollTop = $(".scroll-to-top");
	$(window).on('scroll',function() {
		var topPos = $(this).scrollTop();

		if (topPos > 300) {
			$(scrollTop).css("opacity", "1");

		} else {
			$(scrollTop).css("opacity", "0");
		}

	}); 

	$(scrollTop).on('click',function() {
		$('html, body').animate({
			scrollTop: 0
		}, 800);
		return false;

	}); 


	/**********************
	* Contact Form
	***********************/

	var $form = $('#contact-form');
	var $formMessages = $('.form__output');
	// Set up an event listener for the contact form.
	$form.submit(function(e) {
		// Stop the browser from submitting the form.
		e.preventDefault();

		// Serialize the form data.
		var formData = $(this).serialize();
		// Submit the form using AJAX.
		$.ajax({
			type: 'POST',
			url: $($form).attr('action'),
			data: formData
		})
		.done(function(response) {
			// Make sure that the formMessages div has the 'success' class.
			$formMessages.removeClass('error');
			$formMessages.addClass('success');

			// Set the message text.
			$formMessages.text(response);

			// Clear the form.
			$('#contact-form input,#contact-form textarea').val('');
		})
		.fail(function(data) {
			// Make sure that the formMessages div has the 'error' class.
			$formMessages.removeClass('success');
			$formMessages.addClass('error');

			// Set the message text.
			if (data.responseText !== '') {
				$formMessages.text(data.responseText);
			} else {
				$formMessages.text('Oops! An error occured and your message could not be sent.');
			}
		});
	});



	/**********************
	*Header Toolbar Sidenav Expand
	***********************/

	$('.js-toolbar').on('click', function(e){
		e.preventDefault();
		e.stopPropagation();
		var $this = $(this);
		var target = $this.attr('href');
		var prevTarget = $this.parent().siblings().children('.js-toolbar').attr('href');
		$body.toggleClass('body-open');
		$(target).toggleClass('open');
		$(prevTarget).removeClass('open');
		$($overlay).addClass('overlay-open');
		if($this.attr('class').match(/\b(menu-btn|mainmenu-btn|burger-icon)\b/)){
			$this.toggleClass('open');
		}
	});

	/**********************
	*Click on Documnet
	***********************/

	$body.on('click', function (e){
	    var $target = e.target;
	    var dom = $('.wrapper').children();
	    
	    if (!$($target).is('.toolbar-btn') && !$($target).is('.product-filter-btn') && !$($target).parents().is('.open')) {
	        dom.removeClass('open');
	        $body.removeClass('body-open');
	        dom.find('.open').removeClass('open');
	        $overlay.removeClass('overlay-open');
	    }
	});


	/**********************
	*Close Button Actions
	***********************/

	$('.btn-close').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		$this.parents('.open').removeClass('open');
		$($overlay).removeClass('overlay-open');
	});


	/**********************
	* Expand Button
	***********************/

	$(".expand-btn").on('click', function(e){
		e.preventDefault();
		var target = $(this).attr('href');
		$(target).slideToggle('slow');
	});

	/**********************
	*Expand new shipping info  
	***********************/

	$("#shipdifferetads").on('change', function(){
		if(  $("#shipdifferetads").prop( "checked" ) ){
			$(".ship-box-info").slideToggle('slow');
		}else{
			$(".ship-box-info").slideToggle('slow');
		}
	});

	
	/**********************
	* Expand payment Info
	***********************/

    $('input[name="payment-method"]').on('click', function () {
        var $value = $(this).attr('value');
        $(this).parents('.payment-group').siblings('.payment-group').children('.payment-info').slideUp('300');
        $('[data-method="' + $value + '"]').slideToggle('300');
	});	
	
	/**********************
	* Sticky Header
	***********************/
	var $position = $(window).scrollTop();
	if($position > $headerTotalHeight){
		$('.site-header .header--fixed').addClass('header--unpinned');
	}
	$(window).on('scroll', function() {
	    var $scroll = $(window).scrollTop();
	    if($scroll > $position && $position > $headerTotalHeight) {
	        $('.site-header .header--fixed').addClass('header--unpinned').css('top', 0);
			$('.site-header').addClass('is-sticky');
	        $('.site-header .header--fixed').removeClass('header--pinned');
	    } else if($scroll < $headerPosition || $scroll == 0){
			$('.site-header .header--fixed').removeClass('header--unpinned header--pinned');
			$('.site-header').removeClass('is-sticky');
	    } else if($scroll < $position){
	        $('.site-header .header--fixed').removeClass('header--unpinned');
	        $('.site-header .header--fixed').addClass('header--pinned');
	    }
	    $position = $scroll;
	});

	$('.header-sticky-height').css('height', $mainHeaderHeight);

	/**********************
	*BootStrap Tab
	***********************/ 

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var target = $(e.target).attr("href");
		var relatedTarget = $(e.relatedTarget).attr("href");
		var targetChild = $(target).children().find('.ft-product');
		var relatedTargetChild = $(relatedTarget).children().find('.ft-product');
		$(relatedTargetChild).removeClass('animated');
		$(targetChild).addClass('animated');
	});

	/**********************
	*Progress bar
	***********************/ 

	$('.progress-bar').each(function() {
		var $value = $(this).attr('aria-valuenow');
		$(this).css('width', $value + '%');
	});

	/**********************
	* Product Quantity
	***********************/

    $(".quantity").append('<div class="dec qtybutton">-</div><div class="inc qtybutton">+</div>');

    $(".qtybutton").on("click", function () {
        var $button = $(this);
		var oldValue = $button.parent().find("input").val();
		var newVal;
        if ($button.hasClass("inc")) {
            newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 1) {
                newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 1;
            }
        }
        $button.parent().find("input").val(newVal);
    });	

	/**********************
	* Countdown Timer
	***********************/


	function makeTimer($endDate, $this, $format) {

		var today = new Date();

		var BigDay = new Date($endDate),
		msPerDay = 24 * 60 * 60 * 1000,
		timeLeft = (BigDay.getTime() - today.getTime()),
		e_daysLeft = timeLeft / msPerDay,
		daysLeft = Math.floor(e_daysLeft),
		e_hrsLeft = (e_daysLeft - daysLeft) * 24,
		hrsLeft = Math.floor(e_hrsLeft),
		e_minsLeft = (e_hrsLeft - hrsLeft) * 60,
		minsLeft = Math.floor((e_hrsLeft - hrsLeft) * 60),
		e_secsLeft = (e_minsLeft - minsLeft) * 60,
		secsLeft = Math.floor((e_minsLeft - minsLeft) * 60);

		var yearsLeft = 0;
		var monthsLeft = 0
		var weeksLeft = 0;

		if($format != 'short'){
			if (daysLeft > 365) {
			  yearsLeft = Math.floor(daysLeft / 365);
			  daysLeft = daysLeft % 365;
			}

			if(daysLeft > 30){
				monthsLeft = Math.floor(daysLeft / 30);
				daysLeft = daysLeft % 30;	
			}
			if(daysLeft > 7){
				weeksLeft = Math.floor(daysLeft / 7);
				daysLeft = daysLeft % 7;
			}
		}

		yearsLeft = yearsLeft < 10 ? "0" + yearsLeft : yearsLeft;
		monthsLeft = monthsLeft < 10 ? "0" + monthsLeft : monthsLeft;
		weeksLeft = weeksLeft < 10 ? "0" + weeksLeft : weeksLeft;
		daysLeft = daysLeft < 10 ? "0" + daysLeft : daysLeft;
		hrsLeft = hrsLeft < 10 ? "0" + hrsLeft : hrsLeft;
		minsLeft = minsLeft < 10 ? "0" + minsLeft : minsLeft;
		secsLeft = secsLeft < 10 ? "0" + secsLeft : secsLeft;

		var yearsText = yearsLeft > 1 ? 'years' : 'year',
		monthsText = monthsLeft > 1 ? 'months' : 'month',
		weeksText = weeksLeft > 1 ? 'weeks' : 'week',
		daysText = daysLeft > 1 ? 'days' : 'day',
		hourText = hrsLeft > 1 ? 'hours' : 'hour',
		minsText = minsLeft > 1 ? 'munites' : 'munite',
		secText = secsLeft > 1 ? 'Seconds' : 'Second';

		var $markup = {
			wrapper : $this.find('.countdown__item'),
			year : $this.find('.yearsLeft'),
			month : $this.find('.monthsLeft'),
			week : $this.find('.weeksLeft'),
			day : $this.find('.daysLeft'),
			hour : $this.find('.hoursLeft'),
			minute : $this.find('.minsLeft'),
			second : $this.find('.secsLeft'),
			yearTxt : $this.find('.yearsText'),
			monthTxt : $this.find('.monthsText'),
			weekTxt : $this.find('.weeksText'),
			dayTxt : $this.find('.daysText'),
			hourTxt : $this.find('.hoursText'),
			minTxt : $this.find('.minsText'),
			secTxt : $this.find('.secsText')
		}

		var elNumber = $markup.wrapper.length;
		$this.addClass('item-' + elNumber);
		$($markup.year).html(yearsLeft);
		$($markup.yearTxt).html(yearsText);
		$($markup.month).html(monthsLeft);
		$($markup.monthTxt).html(monthsText);
		$($markup.week).html(weeksLeft);
		$($markup.weekTxt).html(weeksText);
		$($markup.day).html(daysLeft);
		$($markup.dayTxt).html(daysText);
		$($markup.hour).html(hrsLeft);
		$($markup.hourTxt).html(hourText);
		$($markup.minute).html(minsLeft);
		$($markup.minTxt).html(minsText);
		$($markup.second).html(secsLeft);
		$($markup.secTxt).html(secText);
	}

	if($('.countdown').elExists){
		$('.countdown').each(function(){
			var $this = $(this);
			var $endDate = $(this).data('countdown');
			var $format = $(this).data('format');
			setInterval(function() { 
				makeTimer($endDate, $this, $format);	 
			}, 0);
		});
	}


	/**********************
	*Element Carousel
	***********************/ 

	function customPagingNumb($pagingOptions){
		var i = ($pagingOptions.currentSlide ? $pagingOptions.currentSlide : 0) + 1;
		var $current = i.toString().padStart(2, '0');
		var $total = $pagingOptions.slick.slideCount.toString().padStart(2, '0');
		$pagingOptions.selector.html('<span class="current">'+$current+'</span>/<span class="total">'+$total+'</span>');
	}

	function addClassToItem($this){
		$this.find('.slick-slide.slick-active').first().addClass('first-active');
		$this.find('.slick-slide.slick-active').last().addClass('last-active');
	}

	function removeClassFromItem($this){
		$this.find('.slick-slide.slick-active').first().removeClass('first-active');
		$this.find('.slick-slide.slick-active').last().removeClass('last-active');
	}

	if($elementCarousel.elExists()){
		var slickInstances = [];

	    /*For RTL*/
	    if( $html.attr("dir") == "rtl" || $body.attr("dir") == "rtl" ){
	        $elementCarousel.attr("dir", "rtl");
	    }

		$elementCarousel.each(function(index, element){
			var $this = $(this);	

			// Carousel Options
			var $parent = $(this).parent()[0];
			var $status = $($parent).find('.custom-paging');

			var $options = typeof $this.data('slick-options') !== 'undefined' ? $this.data('slick-options') : ''; 

			var $spaceBetween = $options.spaceBetween ? parseInt($options.spaceBetween, 10) : 0,
			    $spaceBetween_xl = $options.spaceBetween_xl ? parseInt($options.spaceBetween_xl, 10) : 0,
			    $rowSpace = $options.rowSpace ? parseInt($options.rowSpace, 10) : 0,
			    $customPaging = $options.customPaging ? $options.customPaging : false,
			    $vertical = $options.vertical ? $options.vertical : false,
			    $focusOnSelect = $options.focusOnSelect ? $options.focusOnSelect : false,
			    $asNavFor = $options.asNavFor ? $options.asNavFor : '',
			    $fade = $options.fade ? $options.fade : false,
			    $autoplay = $options.autoplay ? $options.autoplay : false,
			    $autoplaySpeed = $options.autoplaySpeed ? parseInt($options.autoplaySpeed, 10) : 5000,
			    $swipe = $options.swipe ? $options.swipe : true,
			    $swipeToSlide = $options.swipeToSlide ? $options.swipeToSlide : true,
			    $touchMove = $options.touchMove ? $options.touchMove : true,
			    $verticalSwiping = $options.verticalSwiping ? $options.verticalSwiping : true,
			    $draggable = $options.draggable ? $options.draggable : true,
			    $arrows = $options.arrows ? $options.arrows : false,
			    $dots = $options.dots ? $options.dots : false,
			    $adaptiveHeight = $options.adaptiveHeight ? $options.adaptiveHeight : true,
			    $infinite = $options.infinite ? $options.infinite : false,
			    $centerMode = $options.centerMode ? $options.centerMode : false,
			    $centerPadding = $options.centerPadding ? $options.centerPadding : '',
			    $variableWidth = $options.variableWidth ? $options.variableWidth : false,
			    $speed = $options.speed ? parseInt($options.speed, 10) : 500,
			    $appendArrows = $options.appendArrows ? $options.appendArrows : $this,
			    $prevArrow = $arrows === true ? ($options.prevArrow ? '<span class="'+ $options.prevArrow.buttonClass +'"><i class="'+ $options.prevArrow.iconClass +'"></i></span>' : '<button class="tty-slick-text-btn tty-slick-text-prev">previous</span>') : '',
        		$nextArrow = $arrows === true ? ($options.nextArrow ? '<span class="'+ $options.nextArrow.buttonClass +'"><i class="'+ $options.nextArrow.iconClass +'"></i></span>' : '<button class="tty-slick-text-btn tty-slick-text-next">next</span>') : '',
			    $rows = $options.rows ? parseInt($options.rows, 10) : 1,
			    $rtl = $options.rtl || $html.attr('dir="rtl"') || $body.attr('dir="rtl"') ? true : false,
			    $slidesToShow = $options.slidesToShow ? parseInt($options.slidesToShow, 10) : 1,
			    $slidesToScroll = $options.slidesToScroll ? parseInt($options.slidesToScroll, 10) : 1;

			/*Responsive Variable, Array & Loops*/
			var $responsiveSetting = typeof $this.data('slick-responsive') !== 'undefined' ? $this.data('slick-responsive') : '',
			    $responsiveSettingLength = $responsiveSetting.length,
			    $responsiveArray = [];
			    for (var i = 0; i < $responsiveSettingLength; i++) {
					$responsiveArray[i] = $responsiveSetting[i];
					
				}

			// Adding Class to instances
			$this.addClass('slick-carousel-'+index);		
			$this.parent().find('.slick-dots').addClass('dots-'+index);		
			$this.parent().find('.slick-btn').addClass('btn-'+index);

			if($spaceBetween != 0){
				$this.addClass('slick-gutter-'+$spaceBetween);
			}
			var $slideCount = null;
			$this.on('init', function(event, slick){
				addClassToItem($this);
				$slideCount = slick.slideCount;
				if($slideCount <= $slidesToShow){
					$this.children('.slick-dots').hide();	
				}
				if($customPaging == true){
					var $current = '01';
					var $total = $slideCount.toString().padStart(2, '0');
					$status.html('<span class="current">'+$current+'</span>/<span class="total">'+$total+'</span>');
				}
		        var $firstAnimatingElements = $('.slick-slide').find('[data-animation]');
		        doAnimations($firstAnimatingElements);  
			});

			$this.slick({
				slidesToShow: $slidesToShow,
				slidesToScroll: $slidesToScroll,
				asNavFor: $asNavFor,
				autoplay: $autoplay,
				autoplaySpeed: $autoplaySpeed,
				speed: $speed,
				infinite: $infinite,
				arrows: $arrows,
				dots: $dots,
				adaptiveHeight: $adaptiveHeight,
				vertical: $vertical,
				focusOnSelect: $focusOnSelect,
				centerMode: $centerMode,
				centerPadding: $centerPadding,
				variableWidth: $variableWidth,
				swipe: $swipe,
				swipeToSlide: $swipeToSlide,
				touchMove: $touchMove,
				draggable: $draggable,
				fade: $fade,
				appendArrows: $appendArrows,
				prevArrow: $prevArrow,
				nextArrow: $nextArrow,
				rtl: $rtl,
				responsive: $responsiveArray,
			});

			

			$this.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
				removeClassFromItem($this);
				var $animatingElements = $('.slick-slide[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
				doAnimations($animatingElements);
			});
		    function doAnimations(elements) {
		        var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		        elements.each(function() {
		        	var $el = $(this);
		            var $animationDelay = $el.data('delay');
		            var $animationDuration = $el.data('duration');
		            var $animationType = 'animated ' + $el.data('animation');
		            $el.css({
		                'animation-delay': $animationDelay,
		                'animation-duration': $animationDuration,
		            });
		            $el.addClass($animationType).one(animationEndEvents, function() {
		                $el.removeClass($animationType);
		            });
		        });
		    }

		    $this.on('afterChange', function(e, slick){
				addClassToItem($this);
		    });

			$this.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
				var $pagingOptions = {
					event: event,
					slick: slick,
					currentSlide: currentSlide,
					nextSlide: nextSlide,
					selector: $status
				}
				if($customPaging == true){
					customPagingNumb($pagingOptions);
				}
			});

	        // Updating the sliders in tab
	        $('body').on('shown.bs.tab', 'a[data-toggle="tab"], a[data-toggle="pill"]', function (e) {
	            $this.slick('setPosition');
	        });
		});
	}


	/**********************
	*WOW Js activation 
	***********************/

	new WOW().init();
	$(".wow").each(function() {
		var wowHeight = $(this).height();
		$(this).attr("data-wow-offset", wowHeight);
	});


	/**********************
	*Magnific Popup Activation
	***********************/ 

	var imagePopup = $('.popup-btn');
	var videoPopup = $('.video-popup');

	imagePopup.magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});

	videoPopup.magnificPopup({
		type: 'iframe',
        closeMarkup: '<button type="button" class="custom-close mfp-close"><i class="flaticon-cross"></i></button type="button">'
	});


	$('.zoom').zoom();

	/**********************
	*Nice Select Activation
	***********************/ 

	$('.nice-select').niceSelect();

	/**********************
	*Tooltip
	***********************/

	$('[data-toggle="tooltip"]').tooltip();


	/*================================
	    Accordion 
	==================================*/

	$('.btn-link').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		$this.closest('.card').toggleClass('open');
	});


	/*================================
	    Newsletter Form JS
	==================================*/
	
    var subscribeUrl = $(".mc-form").attr('action');

    $('.mc-form').ajaxChimp({
        language: 'en',
        url: subscribeUrl,
        callback: mailChimpResponse
    });

    function mailChimpResponse(resp) {
        if (resp.result === 'success') {
            $('.mailchimp-success').html('' + resp.msg).fadeIn(900);
            $('.mailchimp-error').fadeOut(400);
            $(".mc-form").trigger('reset');
        } else if (resp.result === 'error') {
            $('.mailchimp-error').html('' + resp.msg).fadeIn(900);
        }
    }



	$('.product-view-mode a').on('click', function(e){
	    e.preventDefault();
	    var $this = $(this);
	    var shopProductWrap = $('.shop-products');
	    var viewMode = $this.data('target');
	    $('.product-view-mode a').removeClass('active');
	    $this.addClass('active');
	    shopProductWrap.removeClass('grid list').addClass(viewMode);
	    if($this.parents('.shop-page-wrapper').hasClass('shop-fullwidth')){
		    if(viewMode === 'list'){
		    	shopProductWrap.removeClass('container-fluid');
				shopProductWrap.addClass('container');
		    }else{
		    	if(shopProductWrap.hasClass('container')){
		    		shopProductWrap.removeClass('container');
					shopProductWrap.addClass('container-fluid');
		    	}
		    }
	    }
	});


	// Button LightGallery JS
    var productThumb = $(".product-gallery__image img"),
        imageSrcLength = productThumb.length,
		images = [];
		

    for (var i = 0; i < imageSrcLength; i++) {
        images[i] = {"src": productThumb[i].src};
    }

    $('.btn-zoom-popup').on('click', function (e) {
        $(this).lightGallery({
            thumbnail: false,
            dynamic: true,
            autoplayControls: false,
            download: false,
            actualSize: false,
            share: false,
            hash: true,
            index: 0,
	        dynamicEl: images
        });
    });

	/**********************
	*Sticky Sidebar
	***********************/

    $('#sticky-sidebar').theiaStickySidebar({
      // Settings
      additionalMarginTop: 95
    });


	/**********************
	*Preloader 
	***********************/

	$(window).on('load', function(){
		$('.pisces-preloader').removeClass("active");
	});


	/**********************
	*Initialization 
	***********************/

	

	$(window).on('load', function(){
		state.window_width = $(window).width();
		$('.ft-preloader').removeClass("active");
	});

    $(window).on('resize', function(){
    	state.window_width = $(window).width();
    });




})(jQuery);
