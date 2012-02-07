/* This view displays the photo gallery.
 *
 * The HTML template for this view is app/views/moustache/gallery.html
 */


Tagshot.Views.PhotoListView = Backbone.View.extend({
	tagName:  "div",
	className: "gallery",
	id: "backbone-gallery-view",

	events: {
		"click" : "deselectAll",
		"click #more" : "loadMoreImages",
		"keydown[ctrl+a]" : "selectAll",
		"keydown[meta+a]" : "selectAll",

		"keydown[tab]" : "jumpToFooter",

		"keydown[shift+left]" : "footerLeft",
		"keydown[shift+right]" : "footerRight"
	},

	initialize: function(options) {
		var self  = this;
		_.bindAll(this);

		this.collection.bind('select', this.select);
		this.collection.bind('deselect', this.showFooterIfNeccessary);
		this.collection.bind('reset', this.reset);
		this.collection.bind('add', this.append);
		this.collection.bind('rescroll', this.rescroll);

		this.quickViewVisible = false;

		_.extend(this.el, Backbone.Events);

		$(document).bind('scroll',this.scrolling);
		$(document).bind('resize',this.scrolling);
		$(document).bind('keydown','ctrl+a',function(evt){
			self.selectAll(evt);
		});
		$(document).bind('keydown','meta+a',function(evt){
			self.selectAll(evt);
		});


		//subviews
		this.subviews = [];
	},

	// helper functions to return all selected
	getSelectedViews: function () {
		return this.subviews.filter(function (el) {
			return el.model.selected;
		});

	},

	rescroll: function () {
		var selectedViews = this.getSelectedViews();
		var photoView = selectedViews[0];
		var top = $(photoView.el).find(".image").offset().top;
		window.scrollTo(0, top - 50);
	},
	
	delegateEventsToSubViews: function() {
		//rebinds events of subviews, in this case the photo views
		_.each(this.subviews, function(view) {
			view.delegateEvents();
		})
	},

	reset: function(e) {
		console.log("reset view");
		this.subviews = [];
		this.render(true);
	},

	render: function(override) {
		if (this.needsNoRender() && !override) {
			console.log("no rerender");
			return this;
		}

		console.log("render gallery");
		
		$(this.el).html(
			"<ul>"+
			"<span id='fix-gallery' class='ui-helper-clearfix'></span>"+
			"</ul>"+
			"<button id='more'>load more...</button>"
		);
		this.collection.each(this.append);

		return this;
	},

	select: function () {
		this.showFooterIfNeccessary();
		if (this.quickViewVisible) {
			var selectedViews = this.getSelectedViews();
			this.quickview(selectedViews[0], true);
		}
	},

	showFooterIfNeccessary: function() {
		var self = this;
		var footer = $('footer');
		if (this.collection.selection().length > 0) {
			footer.stop(true,true).slideDown(400);
		} else {
			window.setTimeout(function(){
				if (self.collection.selection().length == 0) {
					footer.stop(true, true).slideUp(200);	
				} 
			}, 100);
		}
	},

	append: function(photo) {
		if (photo.id in this.subviews) {
			console.error("View is already in subviews, cannot be added again.");
			return;
		}

		var view = new Tagshot.Views.PhotoView( { model: photo } );
		view.bind('selectionChanged', this.selectionChanged);
		view.bind('quickview', this.quickview);
		this.subviews[view.model.id] = view;
		// insert images before the clearfix
		$(this.el).find("#fix-gallery").before(view.render().el);
	},

	quickview: function (photoView, replace) {
		var that = this,
		    viewElement = $(this.photoView).find('img'),
		    model = photoView.model;
		if (!replace) replace = false;

		if (!replace && this.quickViewVisible) {
			$.fancybox.close();
		} else {
			$.fancybox.hideActivity();
			$.fancybox({
				'orig': viewElement,
				'href': model.get('image'),
				'padding': 0,
				'speedIn': 200,
				'speedOut': 200,
				'changeSpeed': 0,
				'changeFade': 0,
				'onStart': function () {
					that.quickViewVisible = true
				},
				'onClosed': function () {
					that.quickViewVisible = false
				},
				'title': model.get('tags').join(', '),
				'transitionIn': 'elastic',
				'transitionOut': 'elastic'
			}); 
		}
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
		var attributes = _.pluck(selection, "attributes");
		var tags = _.pluck(attributes, "tags");
		var intersect = _.intersection.apply(_, tags);
		var list = _.reduce(intersect, function (prev, tag) {
			return prev + "<li class='tag'>" + tag + '<a></a></li>';
		}, "");
		$("footer .textbox").prepend(list);
		Tagshot.tagBox.tagAutocomplete('updateTags');
	},

	stop: function(e) {  
		//avoid event propagation
		e.stopPropagation();
	},

	// scrolling or resizing
	scrolling: function(){
		// do infinite scrolling
		pixelsFromWindowBottom = 0 + $(document).height() - $(window).scrollTop() - $(window).height();
		var pixels = Tagshot.configuration.pixelsFromBottonToTriggerLoad;
		var alreadyLoadedImages = $('.image-view').length >= Tagshot.configuration.numberOfImagesToFetchAtStart;
		if (pixelsFromWindowBottom < pixels && alreadyLoadedImages && $(this.el).is(':visible')) {
			var max = Tagshot.configuration.maxNumberOfImagesBeforeNoAutomaticFetch;
			if (this.collection.length < max) {
				this.loadMoreImages();
			}
		}
	},

	loadMoreImages: function(e) {
		var add = Tagshot.configuration.numberOfImagesToFetchAtAppend;
		this.collection.appendingFetch(add);

		if (this.collection.reachedEnd) {
			$('#more').attr('disabled','disabled');
		}

		if(e) {
			this.stop(e);
		}
	},

	jumpToFooter: function(e) {
		console.log("jump to footer");
		this.stop(e);
		$('footer').find('input').focus();
		this.setInActive();
		return false;
	},

	setActive: function() {
		$('#backbone-gallery-view').addClass('active');
	},

	setInActive: function() {
		$('#backbone-gallery-view').removeClass('active');
	},

	footerLeft: function(e) {
		console.log("footer left");
		//this.jumpToFooter(e);
		//$('footer').trigger("keydown","shift+left");
	},

	footerRight: function(e) {
		console.log("footer right");
		//this.jumpToFooter(e);
	},

	needsNoRender: function() {
		var currentModelHash = this.collection.computeHash();
		if (this.collection.hash === currentModelHash) {
			return true;
		}
		console.log("gallery hash change: " + this.collection.hash + " -> " + currentModelHash);
		this.collection.hash = currentModelHash;
		return false;
	}
});
