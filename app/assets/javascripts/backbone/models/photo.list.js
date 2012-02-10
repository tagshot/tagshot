/* This Collection is a list of photo models.
 * ================================================================================
 * This collection consists of many Tagshot.Models.Photo and is 
 * synchronized with the backend via the backbone functions fetch() and save().
 *
 * The data that is fetched from the backend is stored in attributes.
 *
 * It is the model for photo.list.view.js and has functions for 
 * getting the selection and moving the selection. These functions are mostly 
 * called from the Tagshot.Views.PhotoListView.
 *
 * The collection is ordered by id. If you want to have another order, you have 
 * to adjust the order function in Tagshot.Models.Photo.
 */

//= require tagshot/tagshot.keyboardPhotoSelection

Tagshot.Collections.PhotoList = Backbone.Collection.extend({
	model:               Tagshot.Models.Photo,
	fetching:            false,
	// needed for infinite scrolling
	reachedEnd:          false,
	url:                 "/photos",
	currentSearchQuery:  "",
	currentSources:      [],
	
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
			this.deselectAll( {'exclude': model });
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

	buildQueryWithSources: function () {
		var self = this;
		if (this.currentSources.lenght > 0) {
			ids = "";
			_.each(this.sources, function(id, key){
				ids += id
				var reachedEnd = key===self.currentSources.lenght;
				if (!reachedEnd) {
					ids += "|";
				}
			});
			return this.currentSearchQuery+"source:"+ids;
		} else {
			return this.currentSearchQuery;
		}
		
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
					q: this.buildQueryWithSources()
				}
			}

			this.fetch(options);
		}
	},

	fetchWithQuery: function (query) {
		// fetch models when searching
		if (query)
			this.currentSearchQuery = query

		this.fetch({
			add: true, //not appending
			data: {
				limit: Tagshot.configuration.numberOfImagesToFetchAtStart,
				q: this.buildQueryWithSources()
			}
		});
	},

	fetchStart: function (callback){
		// fetches models that have to be fetched at startup
		var number = Tagshot.configuration.numberOfImagesToFetchAtStart;
		Tagshot.collections.photoList.fetch({
			data: { 
				limit: number, 
				q: this.buildQueryWithSources()
			},
			add: true,
			success: callback
		});
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
	}
});
