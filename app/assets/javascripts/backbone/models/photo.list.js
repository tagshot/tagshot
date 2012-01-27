/* 
 * This model describes…
 */


Tagshot.Collections.PhotoList = Backbone.Collection.extend({
	model: Tagshot.Models.Photo,
	fetching: false,
	// needed for infinite scrolling
	reachedEnd: false,
	url: "/photos",
	// for infinite scrolling
	currentOffset: 0,
	currentSearchQuery: "",
	
	intialize: function() {
		_.bindAll(this, 'selectAll', 'deselectAll', 'url', 'appendingFetch', 'parse', 'search');
		_.bind('fetch',console.log);
	},
	// return the current selection
	selection: function() {
		return this.filter(function(photo){ return photo.selected });
	},
	getMainModel: function() {
		// the main model, meaning the one that may be in the detailed view
		return this.mainModel;
	},
	selectAll: function() {
		_.map(this.models, function(item) { item.select() });
	},
	deselectAll: function(args) {
		args || (args = {});
		_.map(this.models, function(item) { if (item !== args.exclude) item.deselect() });	
	},
	selectFromTo: function(from, to) {
		console.log("select from "+from+" to "+to);
		_.each(this.models, function(item) {
			if(between(from.id,to.id,item.id)){
				item.select();
			}
		});
	},
	appendingFetch: function(add, options) {
		// add: how many images to add
		options || (options = {});
		options.data || (options.data = {});
		self  = this;

		if (!this.fetching && !this.reachedEnd) {
			
			this.fetching = true;

			var options = {
				success: function(e) {
					self.fetching = false;
				},
				add: true,
				data: {
					offset: this.currentOffset,
					limit: add,
					q: self.currentSearchQuery
				}
			}


			//this.currentOffset += add;
			this.currentOffset = this.length + add;

			this.fetch(options);
		}
	},
	parse : function(resp) {
		if (resp.length == 0) {
			//no response, probably reached end
			this.reachedEnd = true;
		}
		return resp;
    },
	comparator: function(photo) {
		return photo.order();
	},
	search: function(searchString) {
		console.log("search for "+searchString);
		if (this.currentSearchQuery != searchString || searchString === "") {
			this.currentSearchQuery = searchString;
			this.fetch({
				add: false, //not appending
				data: {
					limit: 20,
					q: searchString
				}
			});
		}
	}
});
