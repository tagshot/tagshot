/*
 *= require_self
 *= require_tree ./initializers
 *= require_tree ./templates
 *= require_tree ./models
 *= require_tree ./views
 *= require_tree ./routers
 *
 *= require backbone-eventdata
 *= require backbone-navigate
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
	rounter: undefined,

	init: function() {
		Tagshot.views.mainView = new Tagshot.Views.MainView();
	}
};
