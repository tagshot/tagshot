/*
 * Main view that holds the gallery view or the detailed image view
 */

Tagshot.Views.MainView = Backbone.View.extend({
	el:  document,
	initializing: true,
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
		Tagshot.router = new Tagshot.Router();
		Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		Tagshot.views.gallery = new Tagshot.Views.PhotoListView({ collection: Tagshot.collections.photoList });
		Tagshot.views.detail = new Tagshot.Views.DetailListView({ collection: Tagshot.collections.photoList });
		Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();

		_.bindAll(this, "showDetails","showGallery");
		
		this.currentView = Tagshot.views.gallery;

		//hook to navigation events
		Tagshot.router.bind("route:home", this.fetchAndLoadGallery, this);
		Tagshot.router.bind("route:page", this.showGallery, this);
		Tagshot.router.bind("route:search", this.showGallery, this);
		Tagshot.router.bind("route:searchpage", this.showGallery, this);

		Tagshot.router.bind("route:details", this.showDetails, this);

		//navigation with title
		$('#title').click(function(){
			Tagshot.router.navigate('',true);
			return false;
		});

		var match = Backbone.history.start({pushState: true, root: "/"});
		console.log("Match for first url: "+match);

		this.initializing = false;
	},

	render: function () {
		console.log("render the main view with", this.currentView.className);
		$("#backbone-main-view").html(this.currentView.el);
	},

	fetchAndLoadGallery: function () {
		Tagshot.collections.photoList.fetch({data:{limit: 10},success: this.showGallery, append: true});
	},

	showGallery: function() {
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
		var self = this;

		if (id.models) {
			//recent fetch so id is actually a collection and not just a number
			var model = id.models[0];
		} else {
			// if not yet fetched
			if (Tagshot.collections.photoList.get({"id":id}) === undefined) {
				console.log("No model for details yet");
				Tagshot.collections.photoList.fetch({url:"/photos/"+id, success: self.showDetails});
				return;
			}
			// set model from id as number
			var model = Tagshot.collections.photoList.get({"id":id});
		}

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
