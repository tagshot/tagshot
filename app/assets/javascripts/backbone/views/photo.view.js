Tagshot.Views.PhotoView = Backbone.View.extend({
	tagName:  "li",
	className: "image-view",
	initialize : function() {
		this.model.bind('change', this.render, this);
		this.model.bind('destroy', this.remove, this);
	},
	render: function () {
		console.log("render");
		console.log(this);
		// tmpl im index.html
		$(this.el).html(Mustache.to_html($('#image_tmpl').html(), this));

		//make resize of images
		resizeImages();
		return this;
	},
	starHTML: function(){
		return function(text, render) {
			/*var stars = render(text).split("/");
			var blacks = parseInt(stars[0]);
			var whites = parseInt(stars[1]) - blacks;*/
			var blacks = this.model.get("iptc").stars.nr;
			var whites = this.model.get("iptc").stars.of - blacks;
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
        	return this.model.get("selected");
    	},
	events: {
		"click" : "click",
		"dblclick" : "open"
	},
	open : function() {
		// TODO enlarge image
	},
	remove: function() {
		$(this.el).remove();
	},
	click: function(e) {
		e.stopPropagation();
		if (e.shiftKey) {
			// shift -> from..to select
			var self = this;
			var selected = _.filter(this.model.collection.models, function(item) { 
				return between(LastSelected.id,self.model.id,item.id)
			});
			_.map(selected, function(item) {
				item.set({"selected": true})
			});
		} else if (e.ctrlKey || e.metaKey) {
			// ctrl toggle this selection
			var self = this;
			LastSelected = this.model;
			this.model.set({"selected": !self.model.get("selected")});
    		} else {
			LastSelected = this.model;
			_.map(this.model.collection.models, function(item) {
				item.set({"selected": false})
			});
			this.model.set({"selected": true});
		}
	},
});
