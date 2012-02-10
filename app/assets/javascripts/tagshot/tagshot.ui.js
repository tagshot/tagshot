/*
 * Initialize basic ui callbacks and event handlers.
 * ================================================================================
 * This module initializes basic callbacks/event handlers.
 * In addition it deals with UI code like creating buttons etc.
 */

Tagshot.ui = (function () {
	/*
	 * Initialize basic callbacks/event handlers
	 */
	function toggleOptionsContainerOnClick() {
		$("#show-options").click(function () {
			$("#options-container").slideToggle(300);
			$(this).toggleClass("open");
		});
	}
	function jumpFromTagBoxToGalleryWithTab() {
		// Jump from search to gallery with tab.
		Tagshot.ui.selectors.tagBox.bind('keydown', 'tab', function (e) {
			e.stopPropagation();
			$('backbone-gallery-view image-view image-frame:first img').click();
			return true;
		});
	}
	function navigateHomeOnTagshotLogoClick() {
		$('#title').click(function() {
			Tagshot.router.navigate('', { trigger: true });
			return false;
		});
	}

	function initializeSearchBoxAutocompletion() {
		/* apply autocompletion to <input> */
		Tagshot.ui.selectors.searchBox.tagAutocomplete({
			autocompleteList:  Tagshot.tagList,
			onTagAdded:        Tagshot.search,
			onTagRemoved:      Tagshot.search,
			postProcessors:    [Tagshot.converter.inputToStars]
		});
	}

	function initializeTagBoxAutocompletion() {
		Tagshot.ui.selectors.tagBox.tagAutocomplete({
			autocompleteList:          Tagshot.tagList,
			autocompleteListPosition:  'above',
			onTagAdded:                Tagshot.addTag,
			onTagRemoved:              Tagshot.removeTag,
			onKeyEvent:                function (keyEvent) {
				return Tagshot.ui.keyboardPhotoSelection.selectAction(keyEvent);
			}
		});
	}

	function setSearchBoxFocusOnPageLoad() {
		Tagshot.ui.selectors.searchBox.textboxFocusOnStart({
			text:               'Just start searching…',
			cssClassWhenEmpty:  'search-start',
			doFocus:            true
		});
	}

	function insertLoadMoreButton(here) {
		$(here).html(
			"<ul>" +
			"</ul>" +
			"<span id='fix-gallery' class='ui-helper-clearfix'></span>" +
			"<button id='more'>load more...</button>"
		);
	}

	function insertPhoto(view, here) {
		$('ul', here.el).append(view.render().el);
		Tagshot.ui.resize.resizeImages();
	}

	function saveTagsOnTagBoxBlur() {
		Tagshot.ui.selectors.tagBox.blur(function () {
			if (Tagshot.localVersionDirty === false)
				return;

			// Save selection since we will not have it after the timeout.
			// Use timeout because of race conditions with put and fetch of different models.
			var selection = Tagshot.collections.photoList.selection();

			// We only want to show "Tags saved", when all photos in selection have been saved.
			// So we need to save, how many photos have been saved so far.
			var savedPhotos = 0;
			setTimeout(function () {
				_.each(selection,function (model, index) {
					model.save(undefined, {
						success: function() {
							savedPhotos += 1;
							// check if all photos have been saved
							if (savedPhotos === selection.length) {
								Tagshot.ui.userMessages.info("Tags saved", 400);
								Tagshot.localVersionDirty = false;
							}
						}
					});
				});
			}, 500);
		});
	}

	function bindRotateClicks() {
		var rot = Tagshot.rotate;
		$('#rotate-image-left').click(rot.rotateLeft);
		$('#rotate-image-right').click(rot.rotateRight);
	}

	function initBeforeBackbone() {
		Tagshot.ui.resize.init();
	}

	function initAfterBackbone() {
		toggleOptionsContainerOnClick();
		jumpFromTagBoxToGalleryWithTab();
		navigateHomeOnTagshotLogoClick();
		Tagshot.ui.selectors.mainView.append(Tagshot.views.gallery.el);
		Tagshot.ui.selectors.mainView.append(Tagshot.views.detail.el);
		bindRotateClicks();

		Tagshot.sourceSelect.init();
		Tagshot.ui.activeGallery.init();
	}

	/*********************
	 * API Functions
	 * *******************/
	return {
		initAfterBackbone:                  initAfterBackbone,
		initBeforeBackbone:                 initBeforeBackbone,
		initializeSearchBoxAutocompletion:  initializeSearchBoxAutocompletion,
		initializeTagBoxAutocompletion:     initializeTagBoxAutocompletion,
		insertLoadMoreButton:               insertLoadMoreButton,
		insertPhoto:                        insertPhoto,
		setSearchBoxFocusOnPageLoad:        setSearchBoxFocusOnPageLoad,
	};
})();
