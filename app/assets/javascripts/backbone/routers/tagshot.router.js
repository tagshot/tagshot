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

	routes: {
		"reset":                "reset",
		"details/:id":          "details",
		"search/:query":        "search",
		"p/:page":              "page",
		"search/:query/:page":  "searchpage",
		"*foo":					"home"
	},

	home: function(foo) {
		console.log("home", foo);

		if (!Tagshot.initialized.gallery) {
			this.reset();
		}
		Tagshot.initialized.gallery = true;

		this.buildGalleryView();
	},

	// shows the gallery view but does a reset first
	reset: function() {
		var self = this;

		console.log("reset collection");
		Tagshot.collections.photoList.reset();
		this.fetchModels(Tagshot.configuration.numberOfImagesToFetchAtStart, function() {
			self.navigate("", {
				'replace': true,
				'trigger': false
			});
		});
		//this.buildGalleryView();
	},

	details: function (id) {
		console.log("details of", id);

		var model = Tagshot.collections.photoList.get({"id":id});

		if (model === undefined) {
			console.log("model not loaded yet");
			return this.fetchUnloadedModel(path,id);
		}

		this.buildDetailsPage(model);
	},

	search: function (query) {
		console.log("search for: "+query);

		if (_.contains(["snow", "christmas", "schnee", "weihnachten", "winter", "cold", "kalt"], query)) {
			console.log("let it snow");
			snowStorm.start();
		}

		this.buildGalleryView();
		this.fillTagbarWithSearchedTags(query);

		var photolist = Tagshot.collections.photoList;

		if (photolist.currentSearchQuery != query || query === "") {
			console.log("do search");
			photolist.reset();

			photolist.currentSearchQuery = query;
			photolist.fetch({
				add: true, //not appending
				data: {
					limit: Tagshot.configuration.numberOfImagesToFetchAtStart,
					q: query
				}
			});
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

	fetchUnloadedModel: function(path,id) {
		var self = this;
			Tagshot.collections.photoList.fetch({
				url:"/photos/"+id,
				add: true,
				success: function() {
					self.subdetails(path, id);
				}
			});
	},

	buildDetailsPage: function(model) {
		Tagshot.views.detail.render(model);
		$("#backbone-detail-view").show();
		$("#backbone-gallery-view").hide();

		$('#search-container').hide();
		$('#options-container').hide();
		$('#show-options').hide();

		Tagshot.views.detail.delegateEvents();

		// fix for webkit that can't change 
		// display of elements that are not in the dom
		$('footer:first').show();
	},

	buildGalleryView: function() {
		$("#backbone-detail-view").hide();
		$("#backbone-gallery-view").show();
		$('#search-container').show();
		$('#options-container').hide();
		$('#show-options').show();

		$('#backbone-gallery-view').addClass('active');
	},

	fetchModels: function(number, callback) {
		Tagshot.collections.photoList.fetch({
			data: { limit: number },
			add: true,
			success: callback
		});
	},

	fillTagbarWithSearchedTags: function(query) {
		if ($("#search-container .textbox li.tag").length === 0) {
			var tags = Tagshot.converter.queryToInput(query);
			var currentTags = [];
			$("#search-container .textbox li.tag").remove();
			$("#search-container .textbox li.tag").each(function() {
				currentTags.push($(this).text());
			});

			for (var i = 0; i < tags.length; i++) {
				if (currentTags.indexOf(tags[i]) === -1 && tags[i] !== '') {
					$("#search-container .textbox li:last").before('<li class="tag"><span>' + tags[i] + '</span><a></a></li>');
				}
			}
		}
	}
});
