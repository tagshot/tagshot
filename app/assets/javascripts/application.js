// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui-1.8.16.custom.min
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
//= require tags
//= require tagsAutocompletion
//= require search
//= require jquery.fancybox-1.3.4


var uiSettings = {
	searchBoxText: 'Just start searching…'
};

function resizeImages() {
	var value  = $("#thumbnail-size-slider").slider("value");

	$("#backbone-gallery-view div.image").css(
		'height',value).css(
		'width',function(){
			return value*1.6;
		}
	);
}

function hideElements() {
	$("#options-container").hide();
}

function addGlobalAjxIndicator(){
	var indicator = $('#loading-image');

	$(document).ajaxSend(function() {
		indicator.stop(true,true).fadeIn(50);
	});

	$(document).ajaxStop(function() {
		indicator.delay(500).fadeOut(100);
	});
}

$(function() {
	addGlobalAjxIndicator();

	Tagshot.init();

	$.ajax("/tags", {
		success: function (data) {
			/* apply autocompletion to <input> */
			$("#search-box").tagAutocomplete({
				autocompleteList: data,
				onTagAdded: Tagshot.search,
				onTagRemoved: Tagshot.search,
				postProcessors: [
					{
						matches: tagFind.starExpression,
						transform: tagReplace.starExpression
					}
					// TODO: Find OR and AND Expressions
				]
			/* and make it auto-focus on page-load */
			}).textboxFocusOnStart({
				text: uiSettings.searchBoxText,
				cssClassWhenEmpty: 'search-start',
				doFocus: true
			});

			$("#tag-box").tagAutocomplete({
				autocompleteList: data,
				autocompleteListPosition: 'above',
				onTagAdded: Tagshot.addTag,
				onTagRemoved: Tagshot.removeTag
			}).blur(function () {
				// TODO: Rethink this

				// keep selection since we will not have it after the timeout, 
				// timeout because of race conditions with put and fetch of differnt models
				var selection = Tagshot.collections.photoList.selection();
				setTimeout(function () {
					selection.forEach(function (model) {
						model.save(undefined,{
							success: function() {$("#tags-saved").stop(true, true).fadeIn().delay(200).fadeOut()}
						});
					});
				}, 500);
			});

			// options bar stuff
			// TODO refactor

			$("#show-options").click(function() {
				$("#options-container").slideToggle(300);
				$(this).toggleClass("open");
			});

			$("#thumbnail-size-slider").slider({
				orientation: "horizontal",
				range: "min", 
				min: 50,
				max: 500,
				value: 200,
				slide: resizeImages,
				change: resizeImages
			});

			hideElements();


		},
	});
	
});
