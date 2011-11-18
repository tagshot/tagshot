
// array von photos
Tagshot.Collections.PhotoList  = Backbone.Collection.extend({
	model: Tagshot.Models.Photo,
	url: "/photos",
	intialize: function(){
		_.bindAll(this, 'selectAll', 'deselectAll');
	},
	// return the current selection
	selection: function() {
		return this.filter(function(photo){ return photo.get('selected'); });
	},
	selectAll: function() {
		_.map(this.models, function(item) { item.set({"selected": true}) });
	},
	deselectAll: function()	{
		_.map(this.models, function(item) { item.set({"selected": false}) });	
	}
});
