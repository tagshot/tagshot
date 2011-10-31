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

	$("#show-options").click(function() {
		$("#options-container").slideToggle("slow");
	});

	var initial_height = $("#image-view img").height();
	var steps = 200;
	function resize() {
		var value = $("#thumbnail-size-slider").slider("value")/steps;
		$("#image-view img").css({height: initial_height*value});
	}
	
	$("#thumbnail-size-slider").slider({
		orientation: "horizontal",
		range: "min",
		min: 0.5*steps, 
		max: 2*steps, 
		value: steps, 
		slide: resize,
		change: resize
	});

	function dateRangeChanged(){
		// TODO filter backbone model
	}

	$("#date-picker").DatePicker({
		flat: true,
		date: [new Date(),'2011-11-13'],
		current: new Date(),
		calendars: 5,
		mode: 'range',
		starts: 1,
		onchange: dateRangeChanged
	});

	// setze datumsrange mit einem array
	//$('#date-picker').DatePickerSetDate([new Date(),'2011-11-13'])
	

	hideElements();

});

function hideElements() {
	$("#options-container").hide();
	
}

function setCaretPosition(ctrl, pos) {
	ctrl.focus();
	ctrl.setSelectionRange(pos,pos);
}


