Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "div",
	className: "detail",
	events: {
		"click" : "click",
		"click footer" : "stop",
		"change footer #tag-box": "updateTags"
	},
	initialize: function(options) {
		_.bindAll(this, "render", "propHTML", "metaHTML");

		console.log(options);

		//this.model.bind('change', this.render, this);
	},
	render: function(model) {
		this.model = model;
		console.log("render detailed view", this.model);
		var tags = {tags:this.model.get('tags')};
		$(this.el).html(
			Mustache.to_html($('#detail-list-template').html(), this)+
			Mustache.to_html($('#footer-template').html(), tags)
        ).find('footer').show();
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
	metaHTML: function() {
		return function(text, render) {
			var str = '';
			
			$.each(this.model.get("meta"), function(key, value) {
				str += '<dt>' + key + '</dt><dd>' + value + '</dd>';
			});
			return str;
		};
	},
	propHTML: function() {
		return function(text, render) {
			var str = '';
			$.each(this.model.get("properties"), function(key, value) {
				if(key != 'caption' && key != 'rating') {
					if(!value) value = '&lt;not set&gt;'
					str += '<dt class="'+key+'">' + key + '</dt><dd>' + value + '</dd>';
				}
			});
			return str;
		};
	},
	updateTags: function(e) {
		console.log(e);
		var tags = $(this.el).find("#tag-box").val().split(" ")
		this.model.save({'tags': tags});
	},
	stop: function(e) {
		//avoid event propagation
		e.stopPropagation();
	}
});
