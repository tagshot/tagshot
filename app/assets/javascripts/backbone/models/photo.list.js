/* This Collection is a list of photo models.
 * It is the model for photo.list.view.js and it's template is app/views/moustache/gallery.html
 */

//= require tagshot/tagshot.keyboardPhotoSelection

Tagshot.Collections.PhotoList = Backbone.Collection.extend({
	model:               Tagshot.Models.Photo,
	fetching:            false,
	// needed for infinite scrolling
	reachedEnd:          false,
	url:                 "/photos",
	currentSearchQuery:  "",
	
	initialize: function() {
		var that = this;
		_.bindAll(this);
		this.bind('selectNext', this.selectNext);
		this.bind('selectPrevious', this.selectPrevious);
		this.bind('selectAbove', this.selectAbove);
		this.bind('selectBelow', this.selectBelow);
		this.bind('shiftSelectNext', this.shiftSelectNext);
		this.bind('shiftSelectPrevious', this.shiftSelectPrevious);
		this.bind('changeSelection', this.changeSelection);
		this.bind('reset', function () {
			that.currentSearchQuery = "";
			that.reachedEnd = false;
		}, this);

		this.keyboardPhotoSelection = Tagshot.ui.keyboardPhotoSelection;
		this.keyboardPhotoSelection.init(this);
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
	selectNext:           Tagshot.ui.keyboardPhotoSelection.selectNext,
	selectPrevious:       Tagshot.ui.keyboardPhotoSelection.selectPrevious,
	selectAbove:          Tagshot.ui.keyboardPhotoSelection.selectAbove,
	selectBelow:          Tagshot.ui.keyboardPhotoSelection.selectBelow,
	shiftSelectPrevious:  Tagshot.ui.keyboardPhotoSelection.shiftSelectPrevious,
	shiftSelectNext:      Tagshot.ui.keyboardPhotoSelection.shiftSelectNext,

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
		_.each(this.models, function(item) {
			if (between(from.id, to.id, item.id)){
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
