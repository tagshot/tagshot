/* This is the applications's main module.
 * It sets up the backbone.js framework and routes the user to the home view
 * defined in (photo.list.view/gallery.html).
 */

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
	router: undefined,

	// Setup the app
	init: function() {
		Tagshot.router = new Tagshot.Router();
		
		Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		Tagshot.views.gallery = new Tagshot.Views.PhotoListView({ 'collection': Tagshot.collections.photoList });
		Tagshot.views.detail = new Tagshot.Views.DetailListView({ 'model': undefined });
		Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();

		$("#backbone-main-view").append(Tagshot.views.gallery.el);
		$("#backbone-main-view").append(Tagshot.views.detail.el);

		Tagshot.views.gallery.render();
		//Tagshot.views.detail.render();

		console.log("Inserted and rendered all views");

		//navigation with title
		$('#title').click(function(){
			Tagshot.router.navigate('',true);
			return false;
		});

		var match = Backbone.history.start({pushState: true, root: "/"});
		console.log("Match for first url: "+match);
	}
};
