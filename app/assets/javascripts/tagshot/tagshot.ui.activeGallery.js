/* 
 * sets the gallery into an active and inactive state depending on the focus
 */

Tagshot.ui.activeGallery = (function () {
	var selectors = Tagshot.ui.selectors;

	function init() {
		$('#search-container').focusin(setInActive);
		selectors.tagBox.focusin(setInActive);

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
		init:			init,
		setActive:		setActive,
		setInActive:	setInActive
	};
})();


