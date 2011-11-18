
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
		_.map(this.models, function(item) { item.select() });
	},
	deselectAll: function()	{
		_.map(this.models, function(item) { item.deselect() });	
	},
	selectFromTo: function(from, to) {
		_.each(this.models, function(item) { 
			if(between(from.id,to.id,item.id)){
				item.select();
			}
		});
	}
});
