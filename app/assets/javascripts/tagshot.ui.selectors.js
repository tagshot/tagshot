/* This module bundles all jQuery selectors for Tagshot.
 *
 */
//= require tagshot.ui

Tagshot.ui.selectors = (function () {

	var imageForPhotoView = function (view) {
		return $(view.el).find(".image");
	};


	return {
		searchBox: $("#search-box"),
		tagBox:    $("#tag-box"),
		mainView:  $("#backbone-main-view"),
		imageForPhotoView: imageForPhotoView
	};
})();


