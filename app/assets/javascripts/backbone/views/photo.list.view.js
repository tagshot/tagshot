//= require backbone-eventdata

Tagshot.Views.PhotoListView = Backbone.View.extend({
	tagName:  "ul",
	className: "image-list-view",
	initialize: function(options) {
        _.bindAll(this, 'selectAll', 'deselectAll');

        // make this available in render and append
        _.bindAll(this, 'render', 'append');

        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", this.append, this);

        //hook into dom
        $('#backbone-image-list-anchor').html(this.el).children("ul").append("<span id='fix-gallery' class='ui-helper-clearfix'>");

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
        // insert images before the clearfix thingy
		$(this.el).children("#fix-gallery").before(view.render().el);
    },
	events: {
		"click" : "deselectAll",
        "keydown[ctrl+a]" : "selectAll",
        "keydown[meta+a]" : "selectAll"
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
