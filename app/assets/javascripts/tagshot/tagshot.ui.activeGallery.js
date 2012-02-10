/* 
 * sets the gallery into an active and inactive state depending on the focus
 */

Tagshot.ui.activeGallery = (function () {
	function init() {
		$('#search-container').focusin(setInActive);
		Tagshot.ui.selectors.tagBox.focusin(setActive);

		// tried "on" but does not work 
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


