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
		var self = this;
		_.bindAll(this);
		this.bind('selectNext', this.selectNext);
		this.bind('selectPrevious', this.selectPrevious);
		this.bind('selectAbove', this.selectAbove);
		this.bind('selectBelow', this.selectBelow);
		this.bind('shiftSelectNext', this.shiftSelectNext);
		this.bind('shiftSelectPrevious', this.shiftSelectPrevious);
		this.bind('changeSelection', this.changeSelection);
		this.bind('reset', function() {
			self.currentSearchQuery = "";
			self.reachedEnd = false;
		}, this);
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
	selectAbove: function (imagesInRow) {
		var first = _.first(this.selection());
		var index = Math.max(0, this.indexOf(first) - imagesInRow);
		this.deselectAll();
		this.at(index).select();
		this.trigger('rescroll');
	},
	selectBelow: function (imagesInRow) {
		var last = _.last(this.selection());
		var index = Math.min(this.length - 1, this.indexOf(last) + imagesInRow);
		this.deselectAll();
		this.at(index).select();
		this.trigger('rescroll');
	},
	shiftSelectPrevious: function () {
		var first = _.first(this.selection());
		var index = this.indexOf(first);
		index -= 1;
		this.at(index).select();
	},
	shiftSelectNext: function () {
		var last = _.last(this.selection());
		this.at((this.indexOf(last) + 1) % this.length).select();
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

	appendingFetch: function(add, callback) {
		// this function fetches models for infinite scrolling (load more button)
		// add: how many images to add

		if (!this.fetching && !this.reachedEnd) {
			this.setFetchMutex();	// prevent two "load more" requests

			var options = {
				success: this.releaseFetchMutex,
				error: this.releaseFetchMutex,
				complete: callback,
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

	/***************
	* Helpers
	****************/

	releaseFetchMutex: function() {
			this.fetching = false;
	},

	setFetchMutex: function() {
			this.fetching = true;
	},

	computeHash: function() {
		return $.param({
			query: this.currentSearchQuery,
			length: this.length
		})
	}
});
