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

		var numberOfImagesToFetchAtStart = 20;

		this.fetchModels(numberOfImagesToFetchAtStart);
		this.buildGalleryView();
	},

	details: function(id) {
		var model = Tagshot.collections.photoList.get({"id":id});

		if (model === undefined) {
			return this.fetchUnloadedModel(id);
		}

		this.buildDetailsPage(model);
	},

	search: function(query) {
		var tags = query.split('+');
		Tagshot.collections.photoList.search(query);
		var currentTags = [];
		$("#search-container .textbox li.tag").each(function() {
			currentTags.push($(this).text());
		});

		for (var i = 0; i < tags.length; i++) {
			if (currentTags.indexOf(tags[i]) === -1 && tags[i] !== '') {
				$("#search-container .textbox li:last").before('<li class="tag"><span>' + tags[i] + '</span><a></a></li>');
			}
		}

		$("#gallery").show();
		$("#detail").hide();
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

		if (Tagshot.collections.photoList.length < numberOfImagesToFetchAtStart) {
			// if start or resetted
			Tagshot.collections.photoList.fetch({
				data: {limit: numberOfImagesToFetchAtStart},
				add: false
			});
		}
	}

});
