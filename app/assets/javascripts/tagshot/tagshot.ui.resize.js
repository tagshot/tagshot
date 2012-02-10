
Tagshot.ui.resize = (function() {
	function init() {
		$("#thumbnail-size-slider").slider({
			orientation:  "horizontal",
			range:        "min",
			min:          50,
			max:          500,
			value:        200,
			slide:        resizeImages,
			change:       resizeImages
		});
	}

	function resizeImages() {
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
		} else {
			$("#backbone-gallery-view div.image-frame").removeClass("smaller");
		}
	}

	return {
		init:			init,
		resizeImages:	resizeImages
	};
})();
