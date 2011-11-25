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
		alert("select all");
	},
	initialize : function() {
		Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		Tagshot.views.gallery = new Tagshot.Views.PhotoList({ collection: Tagshot.collections.photoList});
		Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();

		Tagshot.collections.photoList.fetch();
	},
	render: function () {
		$("#backbone-main-view").append(Tagshot.views.gallery.render().el);
	}
});
