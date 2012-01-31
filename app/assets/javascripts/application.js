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
//= require tagsAutocompletion
//= require search
//= require jquery.fancybox-1.3.4

$(function() {
	Tagshot.helpers.addGlobalAjaxIndicator();

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
			})
			.textboxFocusOnStart({
				text: 'Just start searching…',
				cssClassWhenEmpty: 'search-start',
				doFocus: true
			});

			$("#tag-box").tagAutocomplete({
				autocompleteList: data,
				autocompleteListPosition: 'above',
				onTagAdded: Tagshot.addTag,
				onTagRemoved: Tagshot.removeTag
			}).blur(function () {
				if (Tagshot.localVersionDirty === false)
					return;

				// keep selection since we will not have it after the timeout, 
				// timeout because of race conditions with put and fetch of different models => this is why we use setTimeout
				var selection = Tagshot.collections.photoList.selection();

				// we only want to show "Tags saved", when all photos in selection have been saved
				// so we need to save, how many photos have been saved so far
				var savedPhotos = 0;
				setTimeout(function () {
					selection.forEach(function (model, index) {
						model.save(undefined,{
							success: function() {
								savedPhotos += 1;
								// check if all photos have been saved
								if (savedPhotos === selection.length) {
									$("#tags-saved").stop(true, true).fadeIn().delay(200).fadeOut();
									Tagshot.localVersionDirty = false;
								}
							}
						});
					});
				}, 500);
			});


			$("#show-options").click(function() {
				$("#options-container").slideToggle(300);
				$(this).toggleClass("open");
			});

			// jump from search to gallery with tab
			$("#tag-box").bind('keydown', 'tab', function(e){
				console.log(123);
				e.stopPropagation();
				$('backbone-gallery-view image-view image-frame:first img').click();
				return true;
			});


			$("#thumbnail-size-slider").slider({
				orientation: "horizontal",
				range: "min", 
				min: 50,
				max: 500,
				value: 200,
				slide: Tagshot.helpers.resizeImages,
				change: Tagshot.helpers.resizeImages
			});


			// initialize Tagshot-stuff (Backbone)
			Tagshot.init();
		},
	});
});
