/*
 * Sends rotate requests to the backend.
 * ================================================================================
 * Currently no implementation since this is not supported by the backend yet.
 */

Tagshot.ui.rotate = (function () {
	function rotateLeft() {
		Tagshot.ui.userMessages.info("Not yet implemented.", 2000);
	}

	function rotateRight() {
		Tagshot.ui.userMessages.info("Not yet implemented.", 2000);
	}

	/*********************
	 * API Functions
	 * *******************/
	return {
		rotateLeft:   rotateLeft,
		rotateRight:  rotateRight,
	};
})();

