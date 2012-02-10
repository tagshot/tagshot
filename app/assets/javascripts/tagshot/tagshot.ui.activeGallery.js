/*
 * Changes the state of the gallery depending on the current focus.
 * ================================================================================
 * Sets the gallery into an active and inactive state, depending on the focus.
 * This causes some small changes in the user interface, for example the border
 * around images is a little bit lighter.
 */

Tagshot.ui.activeGallery = (function () {
	function init() {
		$('#search-container').focusin(setInActive);
		Tagshot.ui.selectors.tagBox.focusin(setActive);

	// tried "on" but does not work 
		selectors.photoListView_imgFrame.live('focus',setActive);
	}

	function setActive() {
		Tagshot.ui.selectors.photoListView.addClass('active');
	}

	function setInActive() {
		Tagshot.ui.selectors.photoListView.removeClass('active');
	}

	/*********************
	 * API Functions
	 * *******************/
	return {
		init:         init,
		setActive:    setActive,
		setInActive:  setInActive
	};
})();


