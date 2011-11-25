/*
 *= require_self
 *= require_tree ./initializers
 *= require_tree ./templates
 *= require_tree ./models
 *= require_tree ./views
 *= require_tree ./routers
 */
//= require backbone-eventdata

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
		Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();

		this.render();

		Tagshot.collections.photoList.fetch();
	},
	render: function () {
		console.log("render the main view");
		$("#backbone-main-view").html(Tagshot.views.gallery.el);
	}
});
