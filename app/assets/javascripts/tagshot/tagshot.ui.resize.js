/*
 * Resizes the images when slider value changes.
 * ================================================================================
 * Whenever the slider in the options-container changes, the images must be
 * resized. This functionality is implemented by this module.
 */

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
		// Get slider value;
		var value = $("#thumbnail-size-slider").slider("value");

		// Invoke infitive scrolling. But only do photoList every 10th time, for performance reasons.
		if (value % 10 === 0) {
			Tagshot.views.gallery.infiniteScrolling();
		}

		// Maintain aspect ratio: 3 / 2
		var width = value * 1.5;
		var height = value;
		_.each($('#backbone-gallery-view .image-frame').get(), function (el) {
			// Set width and height directly on DOM elements
			// Note: Why not jQuery? $(el).css("width", "150px");
			// We had performance issues when resizing loads of images, so we use native javascript support.
			el.style.width = width + "px", 
			el.style.height = height + "px"});

		// When the image size is lower than 150px the tags and stars-rating will not be displayed any longer.
		// We need this class to ensure this.
		if (value <= 150)
			$("#backbone-gallery-view div.image-frame").addClass("smaller");
		else
			$("#backbone-gallery-view div.image-frame").removeClass("smaller");
	}

	return {
		init:			init,
		resizeImages:	resizeImages
	};
})();
