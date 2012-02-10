/*
 * Shows the spinning ajax indicator whenever there is an ajax-request.
 * ================================================================================
 * Shows and hides the indicator at the rightmost edge of the search box.
 * 
 */

Tagshot.ui.ajaxIndicator = (function() {
	function init() {
		var indicator = $('#loading-image');

		$(document).ajaxSend(function () {
			indicator.stop(true, true).fadeIn(50);
		}).ajaxStop(function () {
			indicator.delay(500).fadeOut(100);
		});
	}

	/*********************
	 * API Functions
	 * *******************/
	return {
		init : init,
	};
})();
