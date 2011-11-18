// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require proglag
//= require jquery
//= require jquery_ujs
//= require jquery-ui-1.8.16.custom.min
//= require datepicker
//= require jquery.textbox-focus-on-start
//= require jquery.tab-autocomplete
//= require jquery.hotkeys
//= require underscore
//= require json2
//= require backbone
//= require backbone_rails_sync
//= require backbone_datalink
//= require mustache
//= require backbone/tagshot
//= require_tree .

var uiSettings = {
	searchBoxText: 'Just start searching…'
};

function resizeImages() {
	var value = $("#thumbnail-size-slider").slider("value")/steps;
	$("#gallery-view img").css({height: initial_height*value});
}
function hideElements() {
	$("#options-container").hide();	
}

$(function() {
	Tagshot.init();
	
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

	// TODO replace hard coded
	initial_height = 250;
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
		calendars: 4,
		mode: 'range',
		starts: 1,
		onchange: dateRangeChanged
	});

	// setze datumsrange mit einem array
	//$('#date-picker').DatePickerSetDate([new Date(),'2011-11-13'])
	
	hideElements();
});
