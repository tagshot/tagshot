//= require tagshot/tagshot.ui

Tagshot.ui.keyboardPhotoSelection = (function (photoList) {

	var photoList;

	function init (photoListParam) {
		photoList = photoListParam;
	}

	function selectNext () {
		var last = _.last(photoList.selection());
		photoList.deselectAll();
		photoList.at((photoList.indexOf(last) + 1) % photoList.length).select();
	}
	
	function selectPrevious () {
		var first = _.first(photoList.selection());
		photoList.deselectAll();
		var index = photoList.indexOf(first);
		if (index === 0) index = photoList.length;
		index -= 1;
		photoList.at(index).select();
	}
	function selectAbove (imagesInRow) {
		var first = _.first(photoList.selection());
		var index = Math.max(0, photoList.indexOf(first) - imagesInRow);
		photoList.deselectAll();
		photoList.at(index).select();
		photoList.trigger('rescroll');
	}
	function selectBelow (imagesInRow) {
		var last = _.last(photoList.selection());
		var index = Math.min(photoList.length - 1, photoList.indexOf(last) + imagesInRow);
		photoList.deselectAll();
		photoList.at(index).select();
		photoList.trigger('rescroll');
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
		selectNext: selectNext,
		selectPrevious: selectPrevious,
		selectAbove: selectAbove,
		selectBelow: selectBelow,
		shiftSelectPrevious: shiftSelectPrevious,
		shiftSelectNext: shiftSelectNext
	};
})(Tagshot.collections.photoList);
