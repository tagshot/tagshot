/*
 *= require_self
 *= require_tree .
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
	rounter: false,

	init: function() {
		Tagshot.views.mainView = new Tagshot.Views.MainView();
	}
};
