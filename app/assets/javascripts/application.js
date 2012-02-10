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
//= require tagshot/tagshot.tags
//= require tagshot/tagshot.helpers
//= require tagshot/tagshot.ui
//= require tagshot/tagshot.converter
//= require tagshot/tagshot.search
//= require jquery.fancybox-1.3.4
//= require jquery.jstree

//= require tagshot/tagshot.ui.userMessages
//= require tagshot/tagshot.ui.selectors
//= require tagshot/tagshot.ui.rotate
//= require tagshot/tagshot.ui.sourceSelect
//= require tagshot/tagshot.ui.activeGallery
//= require tagshot/tagshot.ui.ajaxIndicator
//= require tagshot/tagshot.ui.resize

$(function () {
	Tagshot.ui.initBeforeBackbone();
	Tagshot.init();
	Tagshot.ui.initAfterBackbone();

	$.ajax("/tags", {
		success: function (data) {
			Tagshot.tagList = data;

			Tagshot.ui.selectors.searchBox.tagAutocomplete('updateCompletionList', Tagshot.tagList);
			Tagshot.ui.selectors.tagBox.tagAutocomplete('updateCompletionList', Tagshot.tagList);
			Tagshot.ui.setSearchBoxFocusOnPageLoad();

			Tagshot.ui.saveTagsOnTagBoxBlur();
		},
	});
});
