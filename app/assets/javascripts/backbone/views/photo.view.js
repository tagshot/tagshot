//= require backbone-eventdata

Tagshot.Views.PhotoView = Backbone.View.extend({
	tagName:  "li",
	className: "image-view",
	events: {
		"click" : "click",
		"dblclick" : "openDetails"
	},
	initialize : function() {
		_.bindAll(this, 'openDetails', 'click', 'select', 'deselect');

		this.model.bind('change', this.render, this);
		this.model.bind('destroy', this.remove, this);
		this.model.bind('select', this.select, this);
		this.model.bind('deselect', this.deselect, this);
	},
	render: function () {
		console.log("render", this.model.get('id'));
		// tmpl im index.html
		$(this.el).html(Mustache.to_html($('#image-template').html(), this));

		//make resize of images
		resizeImages();

		//delegate events means rebinding the events
		this.delegateEvents();
		return this;
	},
	select: function() {
		$(this.el).children().first().addClass("selected");
	},
	deselect: function() {
		$(this.el).children().first().removeClass("selected");
	},
	starHTML: function(){
		return function(text, render) {
			/*var stars = render(text).split("/");
			var blacks = parseInt(stars[0]);
			var whites = parseInt(stars[1]) - blacks;*/
			var blacks = this.model.get("properties")['rating'] || 0;
			// var whites = this.model.get("stars").stars.of - blacks;
			var whites = 5 - blacks;
			var blackstar = "<a href='#'>&#9733;</a>";
			var whitestar = "<a href='#'>&#9734;</a>";

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
	openDetails : function() {
		Tagshot.router.navigate("details/" + this.model.get("id"), true);
	},
	remove: function() {
		$(this.el).remove();
	},
	click: function(e) {
		//avoid propagation to underlying view(s)
		e.stopPropagation();
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
});
