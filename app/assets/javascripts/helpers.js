Array.prototype.equals = function (arr) {
	if (this.length != arr.length) return false;
	return this.reduce(function (acc, el, i) {
	if (_.isArray(el)) return acc && el.equals(arr[i]);
	return acc && el === arr[i];
}, true)};

Tagshot.helpers = (function() {
	var resizeImages = function () {
		var value = $("#thumbnail-size-slider").slider("value");

		// invoke infinite scrolling in case of resizing
		if (value%10 === 0) {
			Tagshot.views.gallery.infiniteScrolling();
		}

		var width = value * 1.5;
		var height = value;
		_.each($('#backbone-gallery-view .image-frame').get(),function (el) {
			el.style.width = width + "px", 
			el.style.height = height + "px"});

		if (value <= 150) {
			$("#backbone-gallery-view div.image-frame").addClass("smaller");
		}
		else {
			$("#backbone-gallery-view div.image-frame").removeClass("smaller");
		}
	};

	// Show loading image whenever an AJAX request is sent and hide whenever an request returns.
	var addGlobalAjaxIndicator = function () {
		var indicator = $('#loading-image');

		$("body").ajaxSend(function () {
			indicator.stop(true, true).fadeIn(50);
		});

		$("body").ajaxStop(function () {
			indicator.delay(500).fadeOut(100);
		});
	};

	return {
		resizeImages : resizeImages,
		addGlobalAjaxIndicator: addGlobalAjaxIndicator
	};
})();
