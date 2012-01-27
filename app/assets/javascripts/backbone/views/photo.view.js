//= require backbone-eventdata

Tagshot.Views.PhotoView = Backbone.View.extend({
	tagName:  "li",
	className: "image-view",
	events: {
		"click .star-me" : "click",
		"click" : "click",
		"dblclick" : "openDetails",
		"keydown[space]" : "quickview",
		"keydown[return]" : "openDetails",
		"keydown[left]" : "gotoPrevious",
		"keydown[right]" : "gotoNext",
		"keydown[tab]" : "gotoNext"
	},
	initialize : function() {
		_.bindAll(this, 'openDetails', 'click', 'select', 'deselect', 'gotoNext', 'gotoPrevious','quickview', 'rating');

		this.model.bind('change:thumb', this.render, this);
		this.model.bind('change:tags', this.tagChange, this);
		this.model.bind('destroy', this.remove, this);
		this.model.bind('select', this.select, this);
		this.model.bind('deselect', this.deselect, this);

		this.quickViewVisible = false;
	},
	render: function () {
		// tmpl im index.html
		$(this.el).html(Mustache.to_html($('#image-template').html(), this));

		//make resize of images
		resizeImages();

		var stars = this.model.get('properties').rating;
		$(this.el).find(".star-me").starMe({
			'starCount': stars,
			'ratingFunc': this.rating
		});
		//$(this.el).find(".star-me>a:nth-child(2)").click(); works in FF and Chrome

		//delegate events means rebinding the events
		this.delegateEvents();

		return this;
	},

	rating: function(stars) {
		this.model.save({'properties' : {'rating' : stars}});
	},

	tagChange: function () {
		var s = this.model.get("tags").join(", ");
		$(this.el).find(".tags").html(s);
	},
	select: function() {
		$(this.el).children().first().addClass("selected");
		this.trigger("selectionChanged");
	},
	deselect: function() {
		$(this.el).children().first().removeClass("selected");
		this.trigger("selectionChanged");
	},
	isSelected: function() {
		return this.model.selected;
	},
	openDetails : function(e) {
		Tagshot.router.navigate("details/" + this.model.get("id"), true);
	},
	quickview: function(e){
		this.stop(e);

		if (this.quickViewVisible) {
			$.fancybox.close();
			this.quickViewVisible = false;
		} else {
			this.quickViewVisible = true;
			$.fancybox({
				'orig' : $(this.el).find('img'),
				'href' : $(this.el).find('img').attr('src'),
				'padding' : 0,
				'speedIn' :	200,
				'speedOut' :	200,
				'title' : this.model.get('tags'),
				'transitionIn' : 'elastic',
				'transitionOut' : 'elastic'
			}); 
		}
	},
	remove: function() {
		$(this.el).remove();
	},
	click: function(e) {
		this.stop(e);
		$(this.el).find('.image-frame').focus();
		if (e.shiftKey) {
			// shift -> from..to select
			var self = this;
			this.model.collection.selectFromTo(LastSelected, this.model);
		} else if (e.ctrlKey || e.metaKey) {
			// ctrl toggle this selection
			var self = this;
			LastSelected = this.model;
			this.model.toggleSelect();
		} else {
			// deselect all but current
			LastSelected = this.model;
			this.model.collection.deselectAll({'exclude':this.model});
			this.model.select();
		}
	},
	stop: function(e) {  
		//avoid propagation to underlying view(s)
		e.stopPropagation();
	},
	gotoNext: function(e) {
		this.stop(e);
		$(this.el).next().find('.image-frame').focus();
	},
	gotoPrevious: function() {
		$(this.el).prev().find('.image-frame').focus();
	},
});
