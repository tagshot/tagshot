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

var uiSettings = {
	searchBoxText: 'Just start searching…'
};

function resizeImages() {
	var value  = $("#thumbnail-size-slider").slider("value");

	$(".gallery div.image").css(
		'height',value).css(
		'width',function(){
			return value*1.6;
		}
	);
}

function hideElements() {
	$("#options-container").hide();
}

$(function() {
	Tagshot.init();

	$.ajax("/tags", {
		success: function (data) {
			/* apply autocompletion to <input> */
			$("#search-box").tagAutocomplete({
				autocompleteList: data,
				inputCssClass: 'textbox'
			/* and make it auto-focus on page-load */
			}).textboxFocusOnStart({
				text: uiSettings.searchBoxText,
				cssClassWhenEmpty: 'search-start'
			});

			$("#tag-box").tagAutocomplete({
				autocompleteList: data,
				inputCssClass: 'textbox',
				autocompleteListPosition: 'below',
				autoSelect: false,
				onTagAdded: function (tagList) {
					// TODO add '+' means AND, ',' means OR,
					// consult https://student.hpi.uni-potsdam.de/redmine/projects/tagshot/wiki/JSON-API#Search-for-photos

					var searchString = tagList.join("+");

                    // navigate to search and the rest will be done by the backbone fairy
                    Tagshot.router.navigate('search/'+searchString,true);
				},

				postProcessors: [
					{
						matches: tagFind.starExpression,
						transform: tagReplace.starExpression
					}
			// TODO: Find OR and AND Expressions
				]
			});
		},
	});


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
});
