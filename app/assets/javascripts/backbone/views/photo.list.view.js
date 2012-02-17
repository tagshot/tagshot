/* This view displays the photo gallery. 
 * ================================================================================ 
 * It has several Tagshot.Views.PhotoView as subviews 
 * which are added using the function append and then added to the variable subviews. 
 *
 * It is responsible for quickview, appending new images, changing the selection 
 * if all pictures have to be selected and infinite scrolling
 *
 * The HTML template for this view is app/views/moustache/gallery.html
 */

Tagshot.Views.PhotoListView = Backbone.View.extend({
	tagName:          "div",
	className:        "gallery",
	id:               "photo-list-view",
	templateSelector: '#gallery-template',

	events: {
		"click":            "deselectAll",
		"click #more":      "loadMoreImages",
		"keydown[ctrl+a]":  "selectAll",
		"keydown[meta+a]":  "selectAll",
		"keydown[tab]":     "jumpToFooter",
	},

	initialize: function(options) {
		var that  = this;
		_.bindAll(this);

		this.collection.bind('select', this.select);
		this.collection.bind('deselect', this.showFooterIfNecessary);
		this.collection.bind('reset', this.reset);
		this.collection.bind('add', this.append);
		this.collection.bind('rescroll', this.rescroll);

		this.quickViewVisible = false;

		_.extend(this.el, Backbone.Events);

		$(document).bind('scroll', this.infiniteScrolling);
		$(document).bind('resize', this.infiniteScrolling);
		$(document).bind('keydown', 'ctrl+a',function(evt){
			that.selectAll(evt);
		});
		$(document).bind('keydown', 'meta+a', function (evt){
			that.selectAll(evt);
		});

		this.subviews = [];
	},

	// helper functions to return all selected views
	getSelectedViews: function () {
		return this.subviews.filter(function (el) {
			return el.model.selected;
		});
	},

	rescroll: function () {
		// prevents scrolling in out of visible area (browser window)
		var firstView = Tagshot.ui.selectors.imageForPhotoView(this.getSelectedViews()[0]);
		var top = firstView.offset().top;
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

	render: function() {
		console.log("render gallery");
		this.fillTemplate(this.templateSelector);
		this.collection.each(this.append);
		return this;
	},

	select: function () {
		this.showFooterIfNecessary();
		if (this.quickViewVisible) {
			var selectedViews = this.getSelectedViews();
			this.quickview(selectedViews[0], true);
		}
	},

	showFooterIfNecessary: function() {
		// showing the footer is not necessary 
		// if no pictures are selected
		var that = this;
		var footer = $('footer');
		if (this.collection.selection().length > 0) {
			footer.stop(true, true).slideDown(400);
		} else {
			window.setTimeout(function(){
				if (that.collection.selection().length == 0) {
					footer.stop(true, true).slideUp(200);	
				} 
			}, 100);
		}
	},

	fillTemplate: function(selector) {
		$(this.el).html(Mustache.to_html($(selector).html(), this));
	},

	append: function(photo) {
		if (photo.id in this.subviews) {
			console.error("View is already in subviews, cannot be added again.");
			return;
		}

		var view = new Tagshot.Views.PhotoView( { model: photo } );
		this.subviews[view.model.id] = view;
		Tagshot.ui.insertPhoto(view, this);
		this.bindEvents(view);
	},

	quickview: function (photoView, replace) {
		var that = this,
		    viewElement = $('img',photoView.el),
		    model = photoView.model;
		if (!replace) replace = false;

		if (!replace && this.quickViewVisible) {
			$.fancybox.close();
		} else {
			$.fancybox.hideActivity();
			$.fancybox({
				'orig':        viewElement,
				'href':        model.get('image'),
				'padding':     0,
				'speedIn':     200,
				'speedOut':    200,
				'changeSpeed': 0,
				'changeFade':  0,
				'onStart':     function () {
					that.quickViewVisible = true
				},
				'onClosed':    function () {
					that.quickViewVisible = false
				},
				'title':         model.get('tags').join(', '),
				'transitionIn':  'elastic',
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

	selectionChanged: function (e) {
		$("footer .tag").remove();
		var selection = this.collection.selection();
		var attributes = _.pluck(selection, "attributes");
		var tags = _.pluck(attributes, "tags");
		var intersect = _.intersection.apply(_, tags);
		var list = _.reduce(intersect, function (prev, tag) {
			return prev + "<li class='tag'>" + tag + '<a></a></li>';
		}, "");
		$("footer .textbox").prepend(list);
		$(Tagshot.ui.selectors.tagBox).tagAutocomplete('updateTags');
	},

	stop: function (e) {  
		if (!e) return;
		e.stopPropagation();
	},

	infiniteScrolling: function () {
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

	loadMoreImages: function (e) {
		var that = this;

		var add = Tagshot.configuration.numberOfImagesToFetchAtAppend;
		this.collection.appendingFetch(add, function () {
			if (that.collection.reachedEnd) {
				$('#more').attr('disabled','disabled');
			}
		});
		this.stop(e);
	},

	jumpToFooter: function(e) {
		console.log("jump to footer");
		this.stop(e);
		$('footer').find('input').focus();
		return false;
	},

	bindEvents: function(view) {
		view.bind('selectionChanged', this.selectionChanged);
		view.bind('quickview', this.quickview);
	},
	countImagesInARow: function () {
		var offset, count = 0;
		$(".image-view .image").each(function (index, el) {
			if (offset === undefined) {
				offset = $(el).offset().top;
			} else {
				if (offset !== $(el).offset().top)
					return false;
			}
			count += 1;
		});
		return count;
	}
});
