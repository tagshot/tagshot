/*
 * Allows for using the arrow keys to select photos.
 * ================================================================================
 * This module offers methods to select the next, previous, above or below
 * image based on the current selection.
 * Moreover, if passed an Event it automatically selects the appropriate
 * operation to perform.
 *
 * Dependencies:
 *   It needs an Tagshot.Collections.PhotoList to get the current selection and
 *   select elements. This must be passed in via the init method.
 */

//= require tagshot/tagshot.ui

Tagshot.ui.keyboardPhotoSelection = (function () {
	var photoList,
	keyCodes = {
		SPACE: 32,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	};

	function selectAction (keyEvent) {
		// Only invoke action, if current text is empty, so we do not want to navigate in the current text
		if (keyEvent.target.value !== '') return;
		if (keyEvent.shiftKey) {
			switch (keyEvent.keyCode) {
				case keyCodes.LEFT:
					return shiftSelectPrevious();
				case keyCodes.RIGHT:
					return shiftSelectNext();
			}
		}
		else {
			switch (keyEvent.keyCode) {
				case keyCodes.UP:
					return selectAbove(Tagshot.views.gallery.countImagesInARow());
				case keyCodes.DOWN:
					return selectBelow(Tagshot.views.gallery.countImagesInARow());
				case keyCodes.LEFT:
					return selectPrevious();
				case keyCodes.RIGHT:
					return selectNext();
				case keyCodes.SPACE:
					return raiseQuickview();
			}
		}
	}

	function init (photoListParam) {
		photoList = photoListParam;
	}

	function raiseQuickview() {
		var view = Tagshot.views.gallery.getSelectedViews()[0];
		view.trigger('quickview', view);
		return false;
	}

	function selectNext () {
		var last = _.last(photoList.selection());
		photoList.deselectAll();
		photoList.at((photoList.indexOf(last) + 1) % photoList.length).select();
		photoList.trigger('rescroll');
		return false;
	}
	
	function selectPrevious () {
		var first = _.first(photoList.selection());
		photoList.deselectAll();
		var index = photoList.indexOf(first);
		if (index === 0) index = photoList.length;
		index -= 1;
		photoList.at(index).select();
		photoList.trigger('rescroll');
		return false;
	}
	function selectAbove (imagesInRow) {
		var first = _.first(photoList.selection());
		var index = Math.max(0, photoList.indexOf(first) - imagesInRow);
		photoList.deselectAll();
		photoList.at(index).select();
		photoList.trigger('rescroll');
		return false;
	}
	function selectBelow (imagesInRow) {
		var last = _.last(photoList.selection());
		var index = Math.min(photoList.length - 1, photoList.indexOf(last) + imagesInRow);
		photoList.deselectAll();
		photoList.at(index).select();
		photoList.trigger('rescroll');
		return false;
	}
	function shiftSelectPrevious () {
		var first = _.first(photoList.selection());
		var index = photoList.indexOf(first);
		index -= 1;
		photoList.at(index).select();
	}
	function shiftSelectNext () {
		var last = _.last(photoList.selection());
		photoList.at((photoList.indexOf(last) + 1) % photoList.length).select();
	}

	return {
		init: init,
		selectAction: selectAction,
		selectNext: selectNext,
		selectPrevious: selectPrevious,
		selectAbove: selectAbove,
		selectBelow: selectBelow,
		shiftSelectPrevious: shiftSelectPrevious,
		shiftSelectNext: shiftSelectNext
	};
})();
