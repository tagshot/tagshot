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
	// app constants
	HOME_PATH:     '',
	// backbone models 
	Models:        {},
	Collections:   {},
	Routers:       {},
	Views:         {},
	// backbone model instances	
	collections:   {},
	views:         {},
	router:        {},
	// ui
	//ui: {},
	// configuration
	configuration: {
		numberOfImagesToFetchAtStart:             50,
		numberOfImagesToFetchAtAppend:            60,
		maxNumberOfImagesBeforeNoAutomaticFetch:  Number.MAX_VALUE,
		pixelsFromBottonToTriggerLoad:            400
	},
	initialized: {
		gallery: false
	},
	// basic Setup
	init: function() {
		Tagshot.router = new Tagshot.Router();
		Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		Tagshot.views.gallery = new Tagshot.Views.PhotoListView({ 'collection': Tagshot.collections.photoList });
		Tagshot.views.detail = new Tagshot.Views.DetailView({ 'model': undefined });
		Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();

		Backbone.history.start( { pushState: true, root: "/" } );

		Tagshot.views.gallery.render();

		// saves whether the currently local version has already been saved to the server
		Tagshot.localVersionDirty = false;
	}
};
