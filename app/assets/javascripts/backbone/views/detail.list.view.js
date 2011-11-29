Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "div",
	className: "detail",
	events: {
		"click" : "click"
	},
	initialize: function(options) {
		_.bindAll(this, "render", "eachMeta");
	},
	render: function(model) {
		this.model = model;
		console.log("render detailed view", this.model);
		$(this.el).html(Mustache.to_html($('#detail-list-template').html(), this));
		return this;
	},
	click: function(){
		alert("click");
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
	eachMeta: function(dictionary){
		//renders the meta dictionary
		self = this;
		metadata = "";
		console.log("123",this.model.get('meta'));
		_.each(
			self.model.get('meta'),
			function(value, key, list) {
				metadata + "<li><strong>" + key + "</strong>" + value + "</li>"
			}
		);
		return metadata;
	}

});
