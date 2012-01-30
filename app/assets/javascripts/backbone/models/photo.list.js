/* This Collection is a list of photo models.
 * It is the model for photo.list.vie.js and it's template is app/views/moustache/gallery.html
 */


Tagshot.Collections.PhotoList = Backbone.Collection.extend({
	model: Tagshot.Models.Photo,
	fetching: false,
	// needed for infinite scrolling
	reachedEnd: false,
	url: "/photos",
	currentSearchQuery: "",
	
	initialize: function() {
		_.bindAll(this);
	},

	selection: function() {
	// returs the current selection
		return this.filter(function(photo){
			return photo.selected });
	},

	getMainModel: function() {
		// returns the main model, meaning the one that may be in the detailed view
		return this.mainModel;
	},

	selectAll: function() {
		_.map(this.models, function(item) { item.select() });
	},

	deselectAll: function(args) {
		args || (args = {});
		_.map(this.models, function(item) {
			if (item !== args.exclude) item.deselect()
		});
	},

	selectFromTo: function(from, to) {
		console.log("select from "+from+" to "+to);
		_.each(this.models, function(item) {
			if(between(from.id, to.id, item.id)){
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
			// TODO What does this? It should be a separate function
			this.fetching = true;

			var currentOffset = this.length;

			var options = {
				success: function(e) {
					self.fetching = false;
				},
				add: true,
				data: {
					offset: currentOffset,
					limit: add,
					q: self.currentSearchQuery
				}
			}

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
