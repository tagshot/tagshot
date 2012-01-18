

Tagshot.Views.MainView = Backbone.View.extend({
	el:  document,
	events: {
		"keydown[ctrl+a]" : "selectAll",
		"keydown[meta+a]" : "selectAll",
		"scroll": "scrolling",
		"resize": "scrolling"
	},
	selectAll: function() {
		Tagshot.views.gallery.selectAll();
	},
	initialize: function() {
		Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		Tagshot.views.gallery = new Tagshot.Views.PhotoListView({ collection: Tagshot.collections.photoList });
		Tagshot.views.detail = new Tagshot.Views.DetailListView({ collection: Tagshot.collections.photoList });
		Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();
		Tagshot.router = new Tagshot.Router();

		this.currentView = Tagshot.views.gallery;

		this.bind('tagshot:searchTriggered', this.search);

		//hook to navigation events
		Tagshot.router.bind("route:home", this.showGallery, this);
		Tagshot.router.bind("route:details", this.showDetails, this);

		//navigation with title
		$('#title').click(function(){
			Tagshot.router.navigate('',true);
			return false;
		});

		// initial fetch of gallery model
		Tagshot.collections.photoList.fetch({data: {limit: 10}, success: this.startHistory});
	},

	search: function(searchString) {
		Tagshot.collections.photoList.search(searchString);
	},

	startHistory: function() {
		// start Backbone history: a neccesary step for bookmarkable URL's
		Backbone.history.start({pushState: true, root: "/"});
	},

	render: function () {
		console.log("render the main view with", this.currentView.className);
		$("#backbone-main-view").html(this.currentView.el);
	},

	showGallery: function(query, page) {
		this.currentView = Tagshot.views.gallery;
		this.render();
        //rebind events because bindings are lost beacuse of navigation
		Tagshot.views.gallery.delegateEventsToSubViews();
		Tagshot.views.gallery.delegateEvents();

		// set focus to search bar
		$(':focus').focus();
		$('#search-box').focus();

		// fetch some more images if there is space left
		var hasScrollbars = $(document).height() > $(window).height()+10;
		if (!hasScrollbars) {
			this.scrolling();
		}
	},


	showDetails: function(id) {
		var model = Tagshot.collections.photoList.get({"id":id});
		this.currentView = Tagshot.views.detail;
		Tagshot.views.detail.render(model);
		Tagshot.views.detail.delegateEvents();
		this.render();
		//fix for crappy webkit that can't change 
		//dispay of elements that are not in the dom
		$('footer:first').show();
	},

	// scrolling or resizing
	scrolling: function(){
		// do infinite scrolling
		pixelsFromWindowBottom = 0 + $(document).height() - $(window).scrollTop() - $(window).height();
		if (pixelsFromWindowBottom < 200 && this.currentView == Tagshot.views.gallery) {
			var maxNumberOfImagesBeforeNoAutomaticFetch = 20;
			if (this.currentView.collection.length < maxNumberOfImagesBeforeNoAutomaticFetch){
				this.currentView.loadMoreImages();
			}
		} 
	},
});
