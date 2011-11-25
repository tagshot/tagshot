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
		Tagshot.views.mainView = new Tagshot.Views.MainView();
		//Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		//Tagshot.views.gallery = new Tagshot.Views.PhotoListView({collection: Tagshot.collections.photoList});
		//Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();
	}
};
