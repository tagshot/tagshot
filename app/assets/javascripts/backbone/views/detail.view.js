/* 
 * This view is used to display a huge single photo with its tags and metadata.
 */

//=require starMe
//=require jquery.inlineedit

Tagshot.Views.DetailListView = Tagshot.AbstractPhotoView.extend({
	tagName:  "div",
	className: "detail",
	id: "backbone-detail-view",
	templateSelector: '#detail-template',

	events: {
		"click footer" : "stop",
		"change footer #tag-box": "updateTags"
	},

	initialize: function(options) {
		_.bindAll(this);
	},

	render: function(model) {
		if (model) {
			this.model = model;
		}

		if (this.model) {
			var tags = {tags: this.model.get('tags')};

			this.fillTemplate(this.templateSelector);
			this.setStars();
			this.bindInputListener();

		} else {
			this.renderNotfound();
		}

		return this;
	},

	metaHTML: function() {
		return function(text, render) {
			var str = '';
			var metadata = this.model.get("meta");
			$.each(metadata, function(key, value) {
				str += '<dt>' + key + '</dt><dd>' + value + '</dd>';
			});
			return str;
		};
	},

	setStars: function() {
		// copy'n pasted from photo.view.js FIXME
		var stars = this.model.get('properties').rating;
		$(this.el).find(".rating").starMe({
			'starCount': stars,
			'ratingFunc': this.rating
		});
	},

	bindInputListener: function() {
		this.bindSave('.prop dd input');
		this.bindSave('.prop dd textarea');
		this.setFocusIfEmpty('.prop dd input:first');
	},

	bindSave: function(selector) {
		var self = this;
		$(selector).blur(function() {
			var key = $(this).attr('data-key');
			self.saveProperty(key, $(this).val());
		});
	},

	saveProperty: function(key, value) {
		var props = this.model.get('properties');
		props[key] = value;
		this.model.save({'properties': props});
	},

	setFocusIfEmpty: function(selector) {
		if ($(selector).val() === '') {
			$(selector).focus();
		}
	},

	updateTags: function(e) {
		var tags = $("#tag-box").val().split(" ")
		this.model.save({'tags': tags});
	},

	stop: function(e) {
		//avoid event propagation
		e.stopPropagation();
	},

	renderNotfound: function() {
		$(this.el).html("Image not found");
	}
});
