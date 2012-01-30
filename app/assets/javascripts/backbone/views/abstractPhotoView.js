Tagshot.AbstractPhotoView = Backbone.View.extend({
	
	setStars: function() {
		var stars = this.model.get('properties').rating;
		$(this.el).find(".star-me").starMe({
			'starCount': stars,
			'ratingFunc': this.rating
		});
	}

})
