Tagshot.Views.PhotoListView = Backbone.View.extend({
	tagName:  "div",
	className: "gallery",
	id: "backbone-gallery-view",

	events: {
		"click" : "deselectAll",
		"click #more" : "loadMoreImages",
		"click footer" : "stop",
		"keydown[ctrl+a]" : "selectAll",
		"keydown[meta+a]" : "selectAll"
	},
	initialize: function(options) {
		var self  = this;
		_.bindAll(this);

		this.collection.bind('select', this.showFooterIfNeccessary, this);
		this.collection.bind('deselect', this.showFooterIfNeccessary, this);

		this.collection.bind('reset', this.render, this);
		this.collection.bind('add', this.append, this);

		_.extend(this.el,Backbone.Events);

		$(document).bind('scroll',this.scrolling);
		$(document).bind('resize',this.scrolling);
		$(document).bind('keydown',function(evt){ self.el.trigger('keydown',evt.data);});

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
		var signature = $.param({
			query: this.collection.currentSearchQuery,
			length: this.collection.length
        	});

		if (this.signature === signature) return this;

		console.log("signature change: " + this.signature + " -> " + signature);

		this.signature = signature;

		console.log("render gallery");
		
		var tags = {tags:[]};
		$(this.el).html(
			Mustache.to_html($('#searchbar-template').html())+"<ul>"+
			"<span id='fix-gallery' class='ui-helper-clearfix'></span></ul>"+
			"<button id='more'>load more...</button>"+
			Mustache.to_html($('#footer-template').html(), tags)
		);
		console.log("built");
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
		$(this.el).find("#fix-gallery").before(view.render().el);
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

	// scrolling or resizing
	scrolling: function(){
		// do infinite scrolling
		pixelsFromWindowBottom = 0 + $(document).height() - $(window).scrollTop() - $(window).height();
		if (pixelsFromWindowBottom < 200 && $(this.el).is(':visible')) {
			var maxNumberOfImagesBeforeNoAutomaticFetch = 200;
			if (this.collection.length < maxNumberOfImagesBeforeNoAutomaticFetch){
				this.loadMoreImages();
			}
		}
	},
	loadMoreImages: function(e) {
		var imagesToFetch = 10;
		this.collection.appendingFetch(imagesToFetch);

		if (this.collection.reachedEnd) {
			$('#more').attr('disabled','disabled');
		}

		if(e) {
			this.stop(e);
		}
	}
});
