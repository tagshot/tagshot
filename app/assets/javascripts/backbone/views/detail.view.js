/* 
 * This view is used to display a huge single photo with its tags and metadata.
 */

//=require starMe
//=require jquery.inlineedit

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
			this.setStars({});

			this.makePropertiesInlineEdit();

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
		var self = this;
		return function(text, render) {
			var str = '';
			$.each(this.model.get("properties"), function(key, value) {
				if( key != 'rating') {
					if(!value) value = '-';
					str += '<dt class="'+key+'">' + key + '</dt><dd class="e'+key+'">' + value + '</dd>';
					selector = ".e"+key;
					self.makePropertiesInlineEdit(selector,key);
				}
			});
			return str;
		};
	},

	makePropertiesInlineEdit: function(selector, key) {
		var self = this;
		$(selector).inlineEdit({
			hover: 'hoverEdit',
			buttons: '<button class="cancel">cancel</button>',
			placeholder: '',
			saveOnBlur: false,
			save: function( event, hash ) {
				self.model.save({properties: {key: hash.value}});
			},
			cancelOnBlur: false,
			saveOnBlur: true
		});
	},

	setStars: function() {
		// copy'n pasted from photo.view.js FIXME
		var stars = this.model.get('properties').rating;
		$(this.el).find(".star-me").starMe({
			'starCount': stars,
			'ratingFunc': this.rating
		});
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
