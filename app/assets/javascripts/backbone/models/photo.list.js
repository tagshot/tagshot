/* This Collection is a list of photo models.
 * It is the model for photo.list.view.js and it's template is app/views/moustache/gallery.html
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
		this.bind('selectNext', this.selectNext);
		this.bind('selectPrevious', this.selectPrevious);
		this.bind('changeSelection', this.changeSelection);
	},

	changeSelection: function (model, rangeSelect, toggleSelect) {
		if (rangeSelect) {
			// shift -> from..to select
			var firstSelected = _.first(this.selection());
			this.selectFromTo(firstSelected, model);
		} else if (toggleSelect) {
			// ctrl toggle this selection
			model.toggleSelect();
		} else {
			// deselect all but current
			this.deselectAll({'exclude':model});
			model.select();
		}
	},

	selectNext: function () {
		var last = _.last(this.selection());
		this.deselectAll();
		this.at((this.indexOf(last) + 1) % this.length).select();
	},
	selectPrevious: function () {
		var first = _.first(this.selection());
		this.deselectAll();
		var index = this.indexOf(first);
		if (index === 0) index = this.length;
		index -= 1;
		this.at(index).select();
	},

	selection: function() {
		// returns the current selection
		return this.filter(function(photo){
			return photo.selected;
		});
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

	appendingFetch: function(add) {
		// this function fetches models for infinite scrolling (load more button)
		// add: how many images to add

		if (!this.fetching && !this.reachedEnd) {
			this.setFetchMutex();	// prevent two "load more" requests

			var options = {
				success: this.releaseFetchMutex,
				error: this.releaseFetchMutex,
				add: true,	//append models
				data: {
					offset: this.length,
					limit: add,
					q: this.currentSearchQuery
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
					limit: Tagshot.configuration.numberOfImagesToFetchAtStart,
					q: searchString
				}
			});
		}
	},

	/***************
	* Helpers
	****************/

	releaseFetchMutex: function() {
			this.fetching = false;
	},

	setFetchMutex: function() {
			this.fetching = true;
	}
});
