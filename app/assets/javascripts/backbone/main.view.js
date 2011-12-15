/*
 *= require_self
 *= require_tree ./initializers
 *= require_tree ./templates
 *= require_tree ./models
 *= require_tree ./views
 *= require_tree ./routers
 */
//= require backbone-eventdata
//= require backbone-navigate

Tagshot.Views.MainView = Backbone.View.extend({
	el:  document,
	events: {
		"keydown[ctrl+a]" : "selectAll",
		"keydown[meta+a]" : "selectAll",
	},
	selectAll: function() {
		Tagshot.views.gallery.selectAll();
	},
	initialize : function() {
		Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		Tagshot.views.gallery = new Tagshot.Views.PhotoListView({ collection: Tagshot.collections.photoList});
		Tagshot.views.detail = new Tagshot.Views.DetailListView({ collection: Tagshot.collections.photoList});
		Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();
		Tagshot.router = new Tagshot.Router();

		this.currentView = Tagshot.views.gallery;

		//hook to navigation events
		Tagshot.router.bind("route:home", this.showGallery, this);
		Tagshot.router.bind("route:details", this.showDetails, this);

		// initial fetch of gallery model
		Tagshot.collections.photoList.fetch({data: {needed: null}, success: this.startHistory});

	},
	startHistory: function() {
		// Start Backbone history a neccesary step for bookmarkable URL's
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
	},
	showDetails: function(id) {
		var model = Tagshot.collections.photoList.get({"id":id});
		this.currentView = Tagshot.views.detail;
		Tagshot.views.detail.render(model);
		this.render();
		//fix for crappy webkit that can't change 
		//dispay of elements that are not in the dom
		$('footer:first').show();
	}
});
