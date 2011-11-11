// array von photos
Tagshot.Collections.PhotoList  = Backbone.Collection.extend({
	model: Tagshot.Models.Photo,
	url: "/photos",
	// return the current selection
	selection: function() {
		return this.filter(function(photo){ return photo.get('selected'); });
	}
});
