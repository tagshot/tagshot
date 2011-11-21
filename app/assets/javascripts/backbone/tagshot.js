/*
 *= require_self
 *= require_tree ./initializers
 *= require_tree ./templates
 *= require_tree ./models
 *= require_tree ./views
 *= require_tree ./routers
 */

window.Tagshot = {
	// "Classes"
	Models: {},
	Collections: {},
	Routers: {},
	Views: {},
	
	// "Instances"
	collections: {},
	views: {},

	init: function() {
		Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		Tagshot.views.gallery = new Tagshot.Views.PhotoListView({collection: Tagshot.collections.photoList});
		Tagshot.views.main = new Tagshot.Views.MainView();
	}
};
