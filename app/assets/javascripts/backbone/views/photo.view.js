//= require backbone-eventdata

Tagshot.Views.PhotoView = Backbone.View.extend({
	tagName:  "li",
	className: "image-view",
	events: {
		"click" : "click",
		"dblclick" : "openDetails",
		"keydown[return]" : "openDetails",
		"keydown[left]" : "gotoPrevious",
		"keydown[right]" : "gotoNext",
		"keydown[tab]" : "gotoNext"
	},
	initialize : function() {
		_.bindAll(this, 'openDetails', 'click', 'select', 'deselect', 'gotoNext', 'gotoPrevious');

		this.model.bind('change:thumb', this.render, this);
		this.model.bind('change:tags', this.tagChange, this);
		this.model.bind('destroy', this.remove, this);
		this.model.bind('select', this.select, this);
		this.model.bind('deselect', this.deselect, this);
	},
	render: function () {
		// tmpl im index.html
		$(this.el).html(Mustache.to_html($('#image-template').html(), this));

		//make resize of images
		resizeImages();

		//delegate events means rebinding the events
		this.delegateEvents();
		return this;
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
	starHTML: function(){
		return function(text, render) {
		// TODO remove c'n p with detail.list.view.js
			var blacks = this.model.get("properties")['rating'] || 0;
			var whites = 5 - blacks;	// Argh, quick fix for runtime errors
			var blackstar = "<span>&#9733;</span>";
			var whitestar = "<span>&#9734;</span>";

			var buildString = function(star, count) {
				starString = "";
				for(var i=0; i<count; i++) {
					starString = starString + " " + star;
				};
				return starString;
			};

			var blackstars = buildString(blackstar, blacks);
			var whitestars = buildString(whitestar, whites);

			return blackstars+whitestars;
		}
	},
	isSelected: function() {
		return this.model.selected;
	},
	openDetails : function(e) {
		Tagshot.router.navigate("details/" + this.model.get("id"), true);
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
