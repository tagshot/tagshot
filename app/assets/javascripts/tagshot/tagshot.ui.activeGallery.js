/* 
 * sets the gallery into an active and inactive state depending on the focus
 */

Tagshot.ui.activeGallery = (function () {
	init();

	function init() {
		$('#search-container').focusin(setInActive);
		$('#tag-box').focusin(setInActive);

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
		init:			init,
		setActive:		setActive,
		setInActive:	setInActive
	};
})();


