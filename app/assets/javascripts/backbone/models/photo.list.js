// array von photos
Tagshot.Collections.PhotoList  = Backbone.Collection.extend({
	model: Tagshot.Models.Photo,
	fetching: false,
	reachedEnd: false,
	url: function() {
		return this.base_url;
	},
	currentOffset: 0,
	base_url: "photos",
	sort: null,
	intialize: function(){
		_.bindAll(this, 'selectAll', 'deselectAll', 'url', 'appendingFetch', 'parse');
		_.bind('fetch',console.log);
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
	},
	appendingFetch: function(add, options){
		// add: how many images to add
		options || (options = {});
		options.data || (options.data = {});
		self  = this;

		if (!this.fetching && !this.reachedEnd) {
			this.fetching = true;

			options.success = function(e) {
				self.fetching = false;
			}

			options.add = true;
			
			this.currentOffset += add;
			options.data.offset = this.currentOffset;
			
			options.data.limit = add;

			this.fetch(options);
		}
	},
	parse : function(resp, xhr) {
		if (resp.length == 0) {
			//no response, probably reached end
			this.reachedEnd = true;
		}
		return resp;
    },
});
