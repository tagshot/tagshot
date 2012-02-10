//= require/tagshot.ui.selectors

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
		var imgFrame = $(Tagshot.ui.selectors.photoListView_imgFrame);

		_.each(imgFrame.get(),function (el) {
			el.style.width = width + "px", 
			el.style.height = height + "px"});

				if (value <= 150) {
			imgFrame.addClass("smaller");
		} else {
			imgFrame.removeClass("smaller");
		}
	}

	return {
		init:          init,
		resizeImages:  resizeImages
	};
})();
