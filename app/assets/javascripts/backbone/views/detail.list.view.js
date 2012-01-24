/* This view is utilized to display a huge single photo with its tags and metadata
 *
 */

//=require starMe

Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "div",
	className: "detail",
	id: "detail",

	events: {
		"click footer" : "stop",
		"change footer #tag-box": "updateTags"
	},

	initialize: function(options) {
		_.bindAll(this, "render", "propHTML", "metaHTML", "rating");

		console.log(options);
		//this.collection.getMainModel().bind('change', this.render, this);
	},

	render: function() {
		var self = this;

		if (this.collection.getMainModel() != undefined) {
			var tags = {tags:this.collection.getMainModel().get('tags')};
			this.model = this.collection.getMainModel();

			$(this.el).html(
				Mustache.to_html($('#detail-template').html(), this)+
				Mustache.to_html($('#footer-template').html(), tags)
			).find('footer').show();

			var stars = self.collection.getMainModel().get('properties').rating;
			var starMax = 5; 	// TODO fetch it from model

			stars = self.collection.getMainModel().get('properties').rating;
			$(self.el).find(".star-me").starMe({
				'starCount': stars,
				'starMax' : starMax ,
				'ratingFunc': self.rating
			});
		} else {
			$(this.el).html("not found");
		}
		return self;
	},

	rating: function(stars) {
		this.collection.getMainModel().save({'properties' : {'rating' : stars}});
	},

	metaHTML: function() {
		return function(text, render) {
			var str = '';
			
			$.each(this.collection.getMainModel().get("meta"), function(key, value) {
				str += '<dt>' + key + '</dt><dd>' + value + '</dd>';
			});
			return str;
		};
	},

	propHTML: function() {
		return function(text, render) {
			var str = '';
			$.each(this.collection.getMainModel().get("properties"), function(key, value) {
				if(key != 'caption' && key != 'rating') {
					if(!value) value = '&lt;not set&gt;'
					str += '<dt class="'+key+'">' + key + '</dt><dd>' + value + '</dd>';
				}
			});
			return str;
		};
	},

	updateTags: function(e) {
		var tags = $("#tag-box").val().split(" ")
		this.model.save({'tags': tags});
	},

	stop: function(e) {
		//avoid event propagation
		e.stopPropagation();
	}
});
