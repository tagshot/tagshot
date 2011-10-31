var uiSettings = {
	searchBoxText: 'Just start searching…'
};

$(function () {
	var list = [
		"JavaScript",
		"Haskell",
		"Lisp",
		"Scheme",
		"Java"
	];
	$("#search-box").tagAutocomplete({
		autocompleteList: proglag,
		inputCssClass: 'textbox'
	}).textboxFocusOnStart({
		text: uiSettings.searchBoxText,
		cssClassWhenEmpty: 'search-start'
	});

	var initial_height = $("#image-view img").height();

	function resize() {
		var value = $("#thumbnail-size-slider").slider("value")/100;
		$("#image-view img").css({height: initial_height*value});
	}
	
	$("#thumbnail-size-slider").slider({
		orientation: "horizontal",
		range: "min",
		min: 50, 
		max: 300, 
		value: 100, 
		slide: resize,
		change: resize
	});

	$("#date-picker input").DatePicker({
		flat: true,
		date: ['20011-07-28','20011-07-31'],
		current: '2011-07-31',
		calendars: 3,
		mode: 'range',
		starts: 1,
		onchange: function(){}
	});
});

function setCaretPosition(ctrl, pos) {
	ctrl.focus();
	ctrl.setSelectionRange(pos,pos);
}


