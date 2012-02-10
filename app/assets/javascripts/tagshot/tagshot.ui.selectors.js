/* This module bundles all jQuery selectors for Tagshot.
 *
 */
//= require tagshot/tagshot.ui

Tagshot.ui.selectors = (function () {

	function init() {
		return this;
	}

	function imageForPhotoView(view) {
		return $(view.el).find(".image");
	};

	function findRating(view) {
		return $(view.el).find(".rating");
	}


	var photoListView_imgFrame = $("#photo-list-view .image-view .image-frame");
	var photoListView_firstImg = photoListView_imgFrame.first('img');


	return {
		mainView:                $("#backbone-main-view"),
		searchBox:               $("#search-box"),
		tagBox:                  $("#tag-box"),
		footer:                  $('footer'),
		footerTextbox:           $("footer .textbox"),
		tagsInFooter:            $("footer .tag"),
		imageView:               $('.image-view'),
		more:                    $('#more'),
		photoListView:           $('#photo-list-view'),
		photoListView_imgFrame:  photoListView_imgFrame,
		photoListView_firstImg:  photoListView_firstImg,
		imageForPhotoView:       imageForPhotoView,
		findRating:              findRating,
		init:                    init
	};
})();


