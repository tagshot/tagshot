/*
 * Main access station for all jQuery-selectors
 * ================================================================================
 * To avoid cluttering view logic code with html/selektor strings, this module
 * bundles all jQuery-selectors for Tagshot.
 * Access in other code through Tagshot.ui.selectors.[property], where [property]
 * is one of the properties defined below.
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



	// possible performance imporvement here: 
	// evaluate jQuery stuff only once $('footer')

	return {
		mainView:                '#backbone-main-view',
		detailView:              '#backbone-detail-view',
		searchBox:               '#search-box',
		tagBox:                  '#tag-box',
		footer:                  'footer',
		footerTextbox:           "footer .textbox",
		tagsInFooter:            "footer .tag",
		imageView:               '.image-view',
		more:                    '#more',
		photoListView:           '#photo-list-view',
		tagsInSearch:            '#search-container ul li.tag',
		photoListView_imgFrame:  '#photo-list-view .image-view .image-frame',
		photoListView_firstImg:  '#photo-list-view .image-view .image-frame:   first img',
		imageForPhotoView:       imageForPhotoView,
		findRating:              findRating,
		init:                    init
	};
})();


