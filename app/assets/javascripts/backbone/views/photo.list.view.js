Tagshot.Views.PhotoListView = Backbone.View.extend({
	tagName:  "ul",
	className: "image-list-view",
	initialize: function(options) {
        console.log("initialize gallery");

		var self = this;
		$(document).bind('keydown', 'ctrl+a', function() { self.selectAll(self); return false; });
		$(document).bind('keydown', 'cmd+a', function() { self.selectAll(self); return false; });

        _.bindAll(this, 'render', 'append');
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", this.append, this);

        //hook into dom
        $('#backbone-image-list-anchor').html(this.el).children("ul").append("<span class='ui-helper-clearfix'>");

        //initial fetch
        this.collection.fetch();
	},
	render: function() {
		console.log("render whole gallery");
		this.collection.each(this.append);
		return this;
	},
    append: function(photo) {
		var view = new Tagshot.Views.PhotoView({model: photo});
        console.log(view.render().el);
		$(this.el).append(view.render().el);
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
