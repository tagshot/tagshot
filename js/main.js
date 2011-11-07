var uiSettings = {
	searchBoxText: 'Just start searching…'
};

function resizeImages() {
	var value = $("#thumbnail-size-slider").slider("value")/steps;
	$("#image-view img").css({height: initial_height*value});
}

$(function () {
	/* apply autocompletion to <input> */
	$("#search-box").tagAutocomplete({
		autocompleteList: proglag,
		inputCssClass: 'textbox'
	/* and make it auto-focus on page-load */
	}).textboxFocusOnStart({
		text: uiSettings.searchBoxText,
		cssClassWhenEmpty: 'search-start'
	});

	$("#show-options").click(function() {
		$("#options-container").slideToggle(300);
		$(this).toggleClass("open");
	});

	initial_height = $("#image-view img").height();
	steps = 200;

	$("#thumbnail-size-slider").slider({
		orientation: "horizontal",
		range: "min",
		min: 0.5*steps, 
		max: 2*steps, 
		value: steps, 
		slide: resizeImages,
		change: resizeImages
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
