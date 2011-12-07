Tagshot.Views.PhotoListView = Backbone.View.extend({
	tagName:  "ul",
	className: "gallery",
	events: {
		"click" : "deselectAll"
	},
	initialize: function(options) {
		_.bindAll(this, 'selectAll', 'deselectAll');

		// make this available in render and append
		_.bindAll(this, 'render', 'append');

		this.collection.bind('select', this.showFooterIfNeccessary, this);
		this.collection.bind('deselect', this.showFooterIfNeccessary, this);

		this.collection.bind('refresh', this.render, this);
		this.collection.bind("reset", this.render, this);
		this.collection.bind("add", this.append, this);

		//subviews
		this.subviews = {};
	},
	delegateEventsToSubViews: function() {
		//rebinds events of subviews, in this case the photo views
		_.each(this.subviews, function(view) {
			view.delegateEvents();
		})
	},
	render: function() {
		console.log("render whole gallery");
		$(this.el).html("<span id='fix-gallery' class='ui-helper-clearfix'>");
		this.collection.each(this.append);
		return this;
	},
	showFooterIfNeccessary: function() {
		var self = this;
		var footer = $('footer');
		//console.log(this.collection.selection().length);
		if (this.collection.selection().length > 0) {
			footer.stop(true,true).slideDown(400);
		} else {
			window.setTimeout(function(){
				if (self.collection.selection().length == 0) {
					footer.stop(true,true).slideUp(200);	
				} 
			},100);
		}
	},
	append: function(photo) {
		var view = new Tagshot.Views.PhotoView({model: photo});
		this.subviews[view.model.id] = view;
		// insert images before the clearfix thingy
		$(this.el).children("#fix-gallery").before(view.render().el);
	},
	selectAll: function(){
		console.log("select all");
		this.collection.selectAll();
	},
	deselectAll: function(e){
		this.collection.deselectAll();
	}
});
