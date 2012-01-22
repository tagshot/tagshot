/* This view is utilized to display a huge single photo with its tags and metadata
 *
 */

//=require starMe

Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "div",
	className: "detail",

	events: {
		"click footer" : "stop",
		"change footer #tag-box": "updateTags"
	},

	initialize: function(options) {
		_.bindAll(this, "render", "propHTML", "metaHTML", "rating");

		console.log(options);
		//this.model.bind('change', this.render, this);
	},

	render: function(model) {
		var self = this;

		this.model = model;
		var tags = {tags:this.model.get('tags')};
		$(this.el).html(
			Mustache.to_html($('#detail-list-template').html(), this)+
			Mustache.to_html($('#footer-template').html(), tags)
        ).find('footer').show();

		var stars = self.model.get('properties').rating;
		var starMax = 5; 	// TODO fetch it from model
		console.log("Server says rating is: ", self.model.get('properties').rating);

		console.log("------- The Model: ", self.model);
		console.log("------- The Rating: ", self.model.get('properties').rating);

		stars = self.model.get('properties').rating;
		$(self.el).find(".star-me").starMe({
			'starCount': stars, 'starMax' : starMax , 'ratingFunc': self.rating});

		return self;
	},

rating: function(stars) {
		this.model.save({'properties' : {'rating' : stars}});
		console.log(this.model.get('properties').rating, "<----- Is the new rating in the model");
		console.log(this.model.get('properties'), "<----- Are the new properties");
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
		console.log("Update tags and send it to backend");
		var tags = $("#tag-box").val().split(" ")
		this.model.save({'tags': tags});
	},

	stop: function(e) {
		//avoid event propagation
		e.stopPropagation();
	}
});
