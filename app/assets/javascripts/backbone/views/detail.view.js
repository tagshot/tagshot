/* 
 * This view is used to display a huge single photo with its tags and metadata.
 */

//=require starMe

Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "div",
	className: "detail",
	id: "backbone-detail-view",

	events: {
		"click footer" : "stop",
		"change footer #tag-box": "updateTags"
	},

	initialize: function(options) {
		_.bindAll(this);

		//this.model.bind('change', this.render, this);
	},

	render: function(model) {
		if (model) {
			this.model = model;
		}

		if (this.model) {
			var tags = {tags: this.model.get('tags')};

			$(this.el).html(Mustache.to_html($('#detail-template').html(), this));
				//Mustache.to_html($('#footer-template').html(), tags)

			/*
			var stars = this.model.get('properties').rating;
			var starMax = 5;	// TODO fetch it from model

			$(this.el).find(".star-me").starMe({
				'starCount': this.model.get('properties').rating,
				'starMax' : starMax ,
				'ratingFunc': this.rating
			});
			*/
		} else {
			$(this.el).html("Image not found");
		}

		return this;
	},

	rating: function(stars) {
		this.model.save({'properties' : {'rating' : stars}});
	},

	metaHTML: function() {
		return "";
		//TODO nutzen
		return function(text, render) {
			var str = '';
			var metadata = this.model.get("meta");
			$.each(metadata, function(key, value) {
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
		var tags = $("#tag-box").val().split(" ")
		this.model.save({'tags': tags});
	},

	stop: function(e) {
		//avoid event propagation
		e.stopPropagation();
	}
});
