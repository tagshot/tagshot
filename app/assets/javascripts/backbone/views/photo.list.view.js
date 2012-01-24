Tagshot.Views.PhotoListView = Backbone.View.extend({
	tagName:  "ul",
	className: "gallery",
	events: {
		"click" : "deselectAll",
		"click #more" : "loadMoreImages",
		"click footer" : "stop"
	},
	initialize: function(options) {
		_.bindAll(this, 'selectAll', 'deselectAll', 'loadMoreImages');

		// make this available in render and append
		_.bindAll(this);

		this.collection.bind('select', this.showFooterIfNeccessary, this);
		this.collection.bind('deselect', this.showFooterIfNeccessary, this);

		Tagshot.router.bind("route:search", this.search, this);

		//this.collection.bind('refresh', this.render, this);
		this.collection.bind('reset', this.render, this);
		this.collection.bind('add', this.append, this);

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
		console.log("reset gallery view");
		var tags = {tags:[]};
		$(this.el).html(
				"<span id='fix-gallery' class='ui-helper-clearfix'></span>"+
				"<button id='more'>load more...</button>"+
				Mustache.to_html($('#footer-template').html(), tags)
				);
		this.collection.each(this.append);

		return this;
	},
	showFooterIfNeccessary: function() {
		var self = this;
		var footer = $('footer');
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
		view.bind('selectionChanged', this.selectionChanged, this);
		this.subviews[view.model.id] = view;
		// insert images before the clearfix thingy
		$(this.el).children("#fix-gallery").before(view.render().el);
	},
	selectAll: function(){
		this.collection.selectAll();
	},
	deselectAll: function(e){
		this.collection.deselectAll();
	},
	selectionChanged: function(e) {
		$("footer .tag").remove();
		var selection = this.collection.selection();
		var attributes = _.pluck(selection,"attributes");
		var tags = _.pluck(attributes, "tags");
		var intersect = _.intersection.apply(_, tags);
		var list = _.reduce(intersect, function (prev, tag) {
			return prev + "<li class='tag'>" + tag + '<a></a></li>';
		}, "");
		$("footer .textbox").prepend(list);
	},
	stop: function(e) {  
		//avoid event propagation
		e.stopPropagation();
	},
	loadMoreImages: function(e) {
		// scrolling event by main view

		var imagesToFetch = 10;
		this.collection.appendingFetch(imagesToFetch);

		if (this.collection.reachedEnd) {
			$('#more').attr('disabled','disabled');
		}

		if(e) {
			this.stop(e);
		}
	},
	search: function(searchString){
		// called when navigate
		this.collection.search(searchString);
	}
});
