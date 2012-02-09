/*
 * This module initializes basic callbacks/event handlers.
 * In addition it deals with UI code like creating buttons etc.
 */


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

	var initializeSearchBoxAutocompletion = function () {
		/* apply autocompletion to <input> */

		Tagshot.ui.selectors.searchBox.tagAutocomplete({
			autocompleteList: Tagshot.tagList,
			onTagAdded:       Tagshot.search,
			onTagRemoved:     Tagshot.search,
			postProcessors:   [Tagshot.converter.inputToStars]
		});
	};

	var setSearchBoxFocusOnPageLoad = function () {
		Tagshot.ui.selectors.searchBox.textboxFocusOnStart({
			text:               'Just start searching…',
			cssClassWhenEmpty:  'search-start',
			doFocus:            true
		});
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
		$('ul', here.el).append(view.render().el);
	};


	var init = function () {
		toggleOptionsContainerOnClick();
		initializeSlider();
		jumpFromTagBoxToGalleryWithTab();
		navigateHomeOnTagshotLogoClick();
		Tagshot.ui.selectors.mainView.append(Tagshot.views.gallery.el);
		$(Tagshot.MAIN_VIEW).append(Tagshot.views.detail.el);
	};

	/*********************
	 * API Functions
	 * *******************/
	return {
		init:                              init,
		initializeSearchBoxAutocompletion: initializeSearchBoxAutocompletion,
		initializeSlider:                  initializeSlider,
		insertLoadMoreButton:              insertLoadMoreButton,
		insertPhoto:                       insertPhoto,
		jumpFromTagBoxToGalleryWithTab:    jumpFromTagBoxToGalleryWithTab,
		setSearchBoxFocusOnPageLoad:       setSearchBoxFocusOnPageLoad,
		toggleOptionsContainerOnClick:     toggleOptionsContainerOnClick,
	};
})();
