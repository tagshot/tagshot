Tagshot.ui = (function () {
	/*
	 * Initialize basic callbacks/event handlers
	 */
	var toggleOptionsContainerOnClick = function () {
		$("#show-options").click(function () {
			$("#options-container").slideToggle(300);
			$(this).toggleClass("open");
		});
	};
	var initializeSlider = function () {
		$("#thumbnail-size-slider").slider({
			orientation:  "horizontal",
			range:        "min",
			min:          50,
			max:          500,
			value:        200,
			slide:        Tagshot.helpers.resizeImages,
			change:       Tagshot.helpers.resizeImages
		});
	};
	var jumpFromTagBoxToGalleryWithTab = function () {
		// Jump from search to gallery with tab.
		$("#tag-box").bind('keydown', 'tab', function (e) {
			e.stopPropagation();
			$('backbone-gallery-view image-view image-frame:first img').click();
			return true;
		});
	};


	var init = function () {
		toggleOptionsContainerOnClick();
		initializeSlider();
		jumpFromTagBoxToGalleryWithTab();
	};

	var insertRenderButton = function(here) {
		$(here).html(
			"<ul>"+
			"<span id='fix-gallery' class='ui-helper-clearfix'></span>"+
			"</ul>"+
			"<button id='more'>load more...</button>"
		);
	}


	/*********************
	 * API Functions
	 * *******************/
	return {
		init:                            init,
		jumpFromTagBoxToGalleryWithTab:  jumpFromTagBoxToGalleryWithTab,
		initializeSlider:                initializeSlider,
		toggleOptionsContainerOnClick:   toggleOptionsContainerOnClick,
		insertRenderButton:              insertRenderButton,
		searchBox:                       $("#search-box"),
		tagBox:                          $("#tag-box")
	};
})();



