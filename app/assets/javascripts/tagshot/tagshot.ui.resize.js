
Tagshot.ui.resize = (function() {

	//var selectors = Tagshot.ui.selectors;

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
		var imgFrame = Tagshot.ui.selectors.photoListView_imgFrame;

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