Tagshot.Views.PhotoListView = Backbone.View.extend({
	tagName:  "ul",
	className: "image-list-view",
	initialize: function(options) {
		var self = this;
		$(document).bind('keydown', 'ctrl+a', function() { self.selectAll(self); return false; });
		$(document).bind('keydown', 'cmd+a', function() { self.selectAll(self); return false; });
	},
	render: function() {
		console.log("render whole gallery");
//		var renderedPhotos = _.map(this.collection.models, function (photo) {
//			return new Tagshot.Views.PhotoView({model : photo}).render().el;
//		})
//		$(this.el).html(renderedPhotos);
		this.collection.each(function() {
			var view = new Tagshot.Views.PhotoView({model: photo});
			$(this.el).append(view.render().el)
		});
		$('#backbone-image-list-anchor').html(this.el).children("ul").append("<span class='ui-helper-clearfix'>");
		return this;
	},
	events: {
		"click" : "deselectAll"
	},
	selectAll: function(){
		self = Tagshot.collections.photoList;
		_.map(self.models, function(item) { item.set({"selected": true}) });
	},
	deselectAll: function(e){
		console.log(this);
		_.map(this.collection.models, function(item) { item.set({"selected": false}) });
	}
});
