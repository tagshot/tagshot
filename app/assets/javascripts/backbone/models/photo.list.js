
// array von photos
Tagshot.Collections.PhotoList  = Backbone.Collection.extend({
	model: Tagshot.Models.Photo,
	url: "/photos",
	intialize: function(){
		_.bindAll(this, 'selectAll', 'deselectAll');
	},
	// return the current selection
	selection: function() {
		return this.filter(function(photo){ return photo.selected });
	},
	selectAll: function() {
		console.log("select all");
		_.map(this.models, function(item) { item.select() });
	},
	deselectAll: function(args)	{
		args || (args = {});
		console.log("deselect all");
		_.map(this.models, function(item) { if (item !== args.exclude) item.deselect() });	
	},
	selectFromTo: function(from, to) {
		console.log("select from "+from+" to "+to);
		_.each(this.models, function(item) { 
			if(between(from.id,to.id,item.id)){
				item.select();
			}
		});
	}
});
