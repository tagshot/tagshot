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
			autocompleteList:  Tagshot.tagList,
			onTagAdded:        Tagshot.search,
			onTagRemoved:      Tagshot.search,
			postProcessors:    [Tagshot.converter.inputToStars]
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

	function bindRotateClicks() {
		var rot = Tagshot.rotate;
		$('#rotate-image-left').click(rot.rotateLeft);
		$('#rotate-image-right').click(rot.rotateRight);
	}

	var initBeforeBackbone = function() {
		Tagshot.ui.resize.init();
	}

	var initAfterBackbone = function () {
		toggleOptionsContainerOnClick();
		jumpFromTagBoxToGalleryWithTab();
		navigateHomeOnTagshotLogoClick();
		Tagshot.ui.selectors.mainView.append(Tagshot.views.gallery.el);
		Tagshot.ui.selectors.mainView.append(Tagshot.views.detail.el);
		bindRotateClicks();

		Tagshot.sourceSelect.init();
		Tagshot.ui.activeGallery.init();
	};

	/*********************
	 * API Functions
	 * *******************/
	return {
		initBeforeBackbone:                 initBeforeBackbone,
		initAfterBackbone:                  initAfterBackbone,
		initializeSearchBoxAutocompletion:  initializeSearchBoxAutocompletion,
		insertLoadMoreButton:               insertLoadMoreButton,
		insertPhoto:                        insertPhoto,
		jumpFromTagBoxToGalleryWithTab:     jumpFromTagBoxToGalleryWithTab,
		setSearchBoxFocusOnPageLoad:        setSearchBoxFocusOnPageLoad,
		toggleOptionsContainerOnClick:      toggleOptionsContainerOnClick
	};
})();
