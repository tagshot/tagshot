/* This router is the controller and main actor.
 * It's initialized by window.Tagshot.init.
 *
 * Triggering a route will change the view if necessary.
 */

Tagshot.Router = Backbone.Router.extend({

	initialize: function() {
	_.bindAll(this);
	},

	routes: {
		"":							"home",
		"search/:query":			"search",	//search/hasso
		"p/:page":					"page",
		"search/:query/:page":		"searchpage",
		"details/:id":				"details",
		"*foo":						"home"
	},

	home: function(foo) {
		console.log("home");

		var number = Tagshot.configuration.numberOfImagesToFetchAtStart;
		this.fetchModels(number);
		this.buildGalleryView();
	},

	details: function(id) {
		console.log("detail");

		var model = Tagshot.collections.photoList.get({"id":id});

		if (model === undefined) {
			console.log("model not loaded yet");
			return this.fetchUnloadedModel(id);
		}

		this.buildDetailsPage(model);
	},

	search: function(query) {
		if (query === "") {
			this.navigate("", { replace: true, trigger: false });
			return;
		}

		if ($("#search-container .textbox li.tag").length === 0) {
				var tags = query.split('+');
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

		Tagshot.collections.photoList.search(query);
		this.buildGalleryView();
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
				success: function(){
					self.details(id);
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

		this.setFocusToTagBar();
	},

	setFocusToTagBar: function() {
		$('#search-container .textbox li.tag').remove().parent().find("input").focus();
	},

	fetchModels: function(numberOfImagesToFetchAtStart) {
		if (Tagshot.collections.photoList.length == 1) {
			// We come from the detail view
			console.log("reset collection");
			Tagshot.collections.photoList.reset();
		}

		/*
		 * there is a problem with initial loading if there are less images in the database than 2
		 * this is why we need the magic number. we'll try to fix that in the future
		 */
		if (Tagshot.collections.photoList.length < 2) {
			// if start or resetted
			Tagshot.collections.photoList.fetch({
				data: {limit: numberOfImagesToFetchAtStart},
				add: false
			});
		}
	}

});
