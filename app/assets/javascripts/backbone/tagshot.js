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
		Tagshot.collections.photoList.fetch({
			success: function() {
				view = new Tagshot.Views.PhotoListView({
					collection: Tagshot.collections.photoList
				});
			  	view.render();
			  	
			  	// TODO remove, currently for debugging
			  	this.view = view;
			}
		});
	}
};
