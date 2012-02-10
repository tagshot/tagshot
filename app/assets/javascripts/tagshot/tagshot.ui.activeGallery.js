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

		// tried jQuery.on but does not work 
		selectors.tagBox.focusin(setActive);
		$('#backbone-gallery-view .image-frame').live('focus',setActive);
	}

	function setActive() {
		$('#backbone-gallery-view').addClass('active');
	}

	function setInActive() {
		$('#backbone-gallery-view').removeClass('active');
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


