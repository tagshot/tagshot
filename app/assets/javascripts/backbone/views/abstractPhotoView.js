/* This View bundles the common properties for the details and photo view 
 * (all views with just one model)
 * ================================================================================
 * 
 */

Tagshot.AbstractPhotoView = Backbone.View.extend({

	setStars: function() {
		var stars = this.model.get('properties').rating;
		$(this.el).find(".star-me").starMe({
			'starCount': stars,
			'ratingFunc': this.rating
		});
	},

	rating: function(stars) {
		this.model.save({'properties' : {'rating' : stars}});
	},

	fillTemplate: function(selector) {
		$(this.el).html(Mustache.to_html($(selector).html(), this));
	},

	stop: function (e) {
		//avoid propagation to underlying view(s)
		e.stopPropagation();
	}
});
