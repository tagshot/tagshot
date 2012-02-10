/* 
 */

Tagshot.rotate = (function () {
	function rotateLeft() {
		console.log("rotate left");
		Tagshot.ui.userMessages.info("not yet implemented",2000);
	}

	function rotateRight() {
		console.log("rotate right");
		Tagshot.ui.userMessages.info("not yet implemented",2000);
	}

	/*********************
	 * API Functions
	 * *******************/
	return {
		rotateLeft:   rotateLeft,
		rotateRight:  rotateRight,
	};
})();

