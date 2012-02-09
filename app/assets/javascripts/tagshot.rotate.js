/* 
 */

Tagshot.rotate = (function () {
	init();

	function init() {
		$('#rotate-image-left').click(rotateLeft);
		$('#rotate-image-right').click(rotateRight);
	}

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
		init:         init,
		rotateLeft:   rotateLeft,
		rotateRight:  rotateRight,
	};
})();

