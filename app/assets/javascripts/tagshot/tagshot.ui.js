//= require/tagshot.ui.selectors

/*
 * Initialize basic ui callbacks and event handlers.
 * ================================================================================
 * This module initializes basic callbacks/event handlers using jQuery.
 * In addition it deals with UI code like creating buttons etc.
 * The method names are speaking, and the implementation is straightforward.
 */

Tagshot.ui = (function () {
	/*
	 * Initialization
	 */
	// ========== Backbone
	function initBeforeBackbone() {
		Tagshot.ui.resize.init();
		initializeSearchBoxAutocompletion();
		// search box focus must be set after initializing search box autocompletion
		setSearchBoxFocusOnPageLoad();
		initializeTagBoxAutocompletion();
	}
	function initAfterBackbone() {
		toggleOptionsContainerOnClick();
		jumpFromTagBoxToGalleryWithTab();
		navigateHomeOnTagshotLogoClick();
		saveTagsOnTagBoxBlur();
		$(Tagshot.ui.selectors.mainView).append(Tagshot.views.gallery.el);
		$(Tagshot.ui.selectors.mainView).append(Tagshot.views.detail.el);
		bindRotateClicks();

		Tagshot.ui.sourceSelect.init();
		Tagshot.ui.activeGallery.init();
	}
	// ========== Autocompletion
	function initializeSearchBoxAutocompletion() {
		/* apply autocompletion to <input> */
		$(Tagshot.ui.selectors.searchBox).tagAutocomplete({
			autocompleteList:  Tagshot.tagList,
			onTagAdded:        Tagshot.search,
			onTagRemoved:      Tagshot.search,
			postProcessors:    [Tagshot.converter.inputToStars]
		});
	}
	function initializeTagBoxAutocompletion() {
		$(Tagshot.ui.selectors.tagBox).tagAutocomplete({
			autocompleteList:          Tagshot.tagList,
			autocompleteListPosition:  'above',
			onTagAdded:                Tagshot.addTag,
			onTagRemoved:              Tagshot.removeTag,
			onKeyEvent:                function (keyEvent) {
				return Tagshot.ui.keyboardPhotoSelection.selectAction(keyEvent);
			}
		});
	}
	function updateAutocompletionList(newList) {
		var selectors = Tagshot.ui.selectors;
		$(selectors.searchBox).tagAutocomplete('updateCompletionList', newList);
		$(selectors.tagBox).tagAutocomplete('updateCompletionList', newList);
	}

	/*
	 * Callbacks
	 */
	function toggleOptionsContainerOnClick() {
		$("#show-options").click(function () {
			$("#options-container").slideToggle(300);
			$(this).toggleClass("open");
		});
	}
	function navigateHomeOnTagshotLogoClick() {
		$('#title').click(function() {
			Tagshot.router.navigate('', { trigger: true });
			return false;
		});
	}
	function bindRotateClicks() {
		$('#rotate-image-left').click(Tagshot.ui.rotate.rotateLeft);
		$('#rotate-image-right').click(Tagshot.ui.rotate.rotateRight);
	}

	function saveTagsOnTagBoxBlur() {
		$(Tagshot.ui.selectors.tagBox).blur(function () {
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

	/*
	 * Bind IO-Events (focus and keyevents)
	 */
	function jumpFromTagBoxToGalleryWithTab() {
		// Jump from search to gallery with tab.
		$(Tagshot.ui.selectors.tagBox).bind('keydown', 'tab', function (e) {
			e.stopPropagation();
			$(Tagshot.ui.selectors.photoListView_firstImg).click();
			return true;
		});
	}


	function setSearchBoxFocusOnPageLoad() {
		$(Tagshot.ui.selectors.searchBox).textboxFocusOnStart({
			text:               'Just start searching…',
			cssClassWhenEmpty:  'search-start',
			doFocus:            true
		});
	}


	/*
	 * General dom manipulation helpers
	 */
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

	/*********************
	 * API Functions
	 * *******************/
	return {
		initAfterBackbone:                  initAfterBackbone,
		initBeforeBackbone:                 initBeforeBackbone,
		insertLoadMoreButton:               insertLoadMoreButton,
		insertPhoto:                        insertPhoto,
		updateAutocompletionList:           updateAutocompletionList
	};
})();
