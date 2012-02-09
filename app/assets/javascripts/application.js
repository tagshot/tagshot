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
//= require helpers
//= require tagshot.ui
//= require converter
//= require search
//= require jquery.fancybox-1.3.4
//= require jquery.jstree

$(function() {
	// initialize Tagshot (Backbone)
	Tagshot.init();

	Tagshot.ui.init();

	Tagshot.helpers.addGlobalAjaxIndicator();



	$.ajax("/tags", {
		success: function (data) {

			Tagshot.tagList = data;
			/* apply autocompletion to <input> */
			Tagshot.searchBox = $("#search-box");
			Tagshot.searchBox.tagAutocomplete({
				autocompleteList: Tagshot.tagList,
				onTagAdded: Tagshot.search,
				onTagRemoved: Tagshot.search,
				postProcessors: [
					{
						matches: Tagshot.converter.isRatingInput,		// EDIT here
						transform: Tagshot.converter.inputToStars
					}
				]
			/* and make it auto-focus on page-load */
			})
			.textboxFocusOnStart({
				text: 'Just start searching…',
				cssClassWhenEmpty: 'search-start',
				doFocus: true
			});

			Tagshot.tagBox = $("#tag-box");
			Tagshot.tagBox.tagAutocomplete({
				autocompleteList: Tagshot.tagList,
				autocompleteListPosition: 'above',
				onTagAdded: Tagshot.addTag,
				onTagRemoved: Tagshot.removeTag
			}).blur(function () {
				if (Tagshot.localVersionDirty === false)
					return;

				// Save selection since we will not have it after the timeout.
				// Use timeout because of race conditions with put and fetch of different models.
				var selection = Tagshot.collections.photoList.selection();

				// We only want to show "Tags saved", when all photos in selection have been saved.
				// So we need to save, how many photos have been saved so far.
				var savedPhotos = 0;
				setTimeout(function () {
					_.each(selection,function (model, index) {
						model.save(undefined,{
							success: function() {
								savedPhotos += 1;
								// check if all photos have been saved
								if (savedPhotos === selection.length) {
									Tagshot.helpers.message("Tags saved", 400);
									Tagshot.localVersionDirty = false;
								}
							}
						});
					});
				}, 500);
			});
		},
	});
});
