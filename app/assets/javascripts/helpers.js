Tagshot.helpers = {};

// Resizes the images when the slider value changed.
Tagshot.helpers.resizeImages = function () {
	var value  = $("#thumbnail-size-slider").slider("value");

	$("#backbone-gallery-view div.image-frame").css(
		'height',value).css(
		'width',function(){
			return value*1.5;
		}
	);

	if (value <= 120) {
		$("#backbone-gallery-view div.image-frame").addClass("smaller");
	}
	else {
		$("#backbone-gallery-view div.image-frame").removeClass("smaller");
	}
}

// Show loading image whenever an AJAX request is sent and hide whenever an request returns.
Tagshot.helpers.addGlobalAjaxIndicator = function () {
	var indicator = $('#loading-image');

	$("body").ajaxSend(function() {
		indicator.stop(true,true).fadeIn(50);
	});

	$("body").ajaxStop(function() {
		indicator.delay(500).fadeOut(100);
	});
}
