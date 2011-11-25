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
		"openDetails": "openDetails"
	},
	selectAll: function() {
		Tagshot.views.gallery.selectAll();
	},
	initialize : function() {
		Tagshot.collections.photoList = new Tagshot.Collections.PhotoList();
		Tagshot.views.gallery = new Tagshot.Views.PhotoListView({ collection: Tagshot.collections.photoList});
		Tagshot.views.detail = new Tagshot.Views.DetailListView({ collection: Tagshot.collections.photoList});
		Tagshot.views.ajaxError = new Tagshot.Views.AjaxError();

		this.currentView = Tagshot.views.gallery;
		this.render();

		Tagshot.collections.photoList.fetch();
	},
	render: function () {
		console.log("render the main view");
		$("#backbone-main-view").html(this.currentView.el);
	},
	openDetails: function(model) {
		alert(model);
	}
});
