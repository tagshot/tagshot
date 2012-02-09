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
	var navigateHomeOnTagshotLogoClick = function () {
		$('#title').click(function() {
			Tagshot.router.navigate('', { trigger: true });
			return false;
		});
	};

	var init = function () {
		toggleOptionsContainerOnClick();
		initializeSlider();
		jumpFromTagBoxToGalleryWithTab();
		navigateHomeOnTagshotLogoClick();
		$(Tagshot.MAIN_VIEW).append(Tagshot.views.gallery.el);
		$(Tagshot.MAIN_VIEW).append(Tagshot.views.detail.el);
	};

	var insertLoadMoreButton = function(here) {
		$(here).html(
			"<ul>" +
			"</ul>" +
			"<span id='fix-gallery' class='ui-helper-clearfix'></span>" +
			"<button id='more'>load more...</button>"
		);
	};

	var insertPhoto = function(view, here) {
		$('ul', here).append(view.render().el);
	};


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
		tagBox:                          $("#tag-box"),
		insertPhoto:                     insertPhoto
	};
})();



