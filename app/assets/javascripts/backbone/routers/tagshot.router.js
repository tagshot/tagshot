/* This router is the controller and main actor.
 * It's initialized by window.Tagshot.init.
 *
 * Triggering a route will change the view if neccessary.
 */
//= require snowstorm

Tagshot.Router = Backbone.Router.extend({

	initialize: function () {
		_.bindAll(this);
	},

	/*
	 * Note: The order in which these routes are defined is important
	 *       Do not change without knowing what to do.
	 */
	routes: {
		"reset":                "reset",
		"details/:id":          "details",
		"search/:query":        "search",
		"p/:page":              "page",
		"search/:query/:page":  "searchpage",
		"*foo":                 "home"
	},

	home: function(foo) {
		console.log("home", foo);

		if (!Tagshot.initialized.gallery) {
			this.reset();
		}
		Tagshot.initialized.gallery = true;

		var cameFromSearch = Tagshot.collections.photoList.currentSearchQuery !== "";
		if (cameFromSearch) {
			this.reset();
		}

		this.showGalleryView();
	},

	// shows the gallery view but does a reset first
	reset: function() {
		var self = this;

		console.log("reset collection");
		Tagshot.collections.photoList.reset();
		Tagshot.collections.photoList.currentSearchQuery = "";
		$(Tagshot.ui.selectors.tagsInSearch).remove()
		Tagshot.collections.photoList.fetchStart(function() {
			self.navigate("", {
				'replace': true,
				'trigger': false
			});
		});
		//this.showGalleryView();
	},

	details: function (id) {
		console.log("details of", id);

		var model = Tagshot.collections.photoList.get({"id":id});

		if (model === undefined) {
			console.log("model not loaded yet");
			return this.fetchUnloadedModel(id);
		}

		Tagshot.views.detail.render(model);
		this.showDetailsPage(model);
	},

	search: function (query) {
		console.log("search for: "+query);

		if (_.contains(["snow", "christmas", "schnee", "weihnachten", "winter", "cold", "kalt"], query)) {
			console.log("let it snow");
			snowStorm.start();
		}

		this.showGalleryView();
		this.fillTagbarWithSearchedTags(query);

		var photolist = Tagshot.collections.photoList;

		if (photolist.currentSearchQuery != query || query === "") {
			console.log("do search");

			photolist.fetchWithQuery(query);
		}
	},


	/*******************
	 * Not (yet) used routes
	 *******************/

	page: function(page) {
		console.log("page: ", page);
	},

	searchpage: function(query, page) {
		console.log("searchpage: "+query+" "+page);
	},

	/*******************
	 * Helpers
	 *******************/

	fetchUnloadedModel: function(id) {
		var self = this;
			Tagshot.collections.photoList.fetch({
				url:"/photos/"+id,
				add: true,
				success: function() {
					self.details(id);
				}
			});
	},

	showDetailsPage: function(model) {
		var photoListView = $(Tagshot.ui.selectors.photoListView);
		photoListView.show();
		photoListView.hide();

		$('#search-container').hide();
		//$('#options-container').hide();
		$('#show-options').hide();

		Tagshot.views.detail.delegateEvents();

		$('footer:first').show();
	},

	showGalleryView: function() {
		var selectors = Tagshot.ui.selectors;
		$(selectors.detailView).hide();
		$(selectors.photoListView).show();
		$('#search-container').show();
		$('#show-options').show();
		$(selectors.photoListView).addClass('active');
	},

	fillTagbarWithSearchedTags: function (query) {
		var tagLIs = $("#search-container .textbox li.tag");
		if (tagLIs.length !== 0)
			return;
		var tags = Tagshot.converter.queryToInput(query);
		//var sources = Tagshot.converter.queryToSources(query);

		for (var i = 0; i < tags.length; i += 1) {
			$("#search-box").parent().before('<li class="tag"><span>' + tags[i] + '</span><a></a></li>');
		};
	}
});
