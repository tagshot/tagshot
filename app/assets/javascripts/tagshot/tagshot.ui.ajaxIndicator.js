
Tagshot.ui.ajaxIndicator = (function() {
	// Show loading image whenever an AJAX request is sent and hide whenever an request returns.
	function init() {
		var indicator = $('#loading-image');

		$("body").ajaxSend(function () {
			indicator.stop(true, true).fadeIn(50);
		});

		$("body").ajaxStop(function () {
			indicator.delay(500).fadeOut(100);
		});
	}

	return {
		init : init,
	};
})();
