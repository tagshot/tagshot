/*
 * This router is the controller and main actor. 
 * It's initialized by window.Tagshot.init
 *
 * Triggering a route will change the view if necessary
 */

Tagshot.Router = Backbone.Router.extend({
	initialize: function(){},
	routes: {
		"":							"home",
		"search/:query":			"search",	//search/hasso
		"p/:page":					"page",
		"search/:query/:page":		"searchpage",
		"details/:id":				"details",
		"*foo":						"home"
	},

	home: function(foo) {

		if (Tagshot.collections.photoList.length == 1) {
			console.log("reset collection");
			Tagshot.collections.photoList.reset();
		}
		

		Tagshot.collections.photoList.fetch({
			data: {limit: 10},
			add: true
		});

		//rebind events because bindings are lost because of navigation
		//Tagshot.views.gallery.delegateEventsToSubViews();
		//Tagshot.views.gallery.delegateEvents();

		$("#backbone-detail-view").hide();
		$("#backbone-gallery-view").show();


		// set focus to search bar
		$('#search-container .textbox li.tag').remove().parent().find("input").focus();

	},

	search: function(query) {
		var tags = query.split('+');
		Tagshot.collections.photoList.search(query);
		var currentTags = [];
		$("#search-container .textbox li.tag").each(function() { currentTags.push($(this).text()) });

		for (var i = 0; i < tags.length; i++) {
			if (currentTags.indexOf(tags[i]) === -1 && tags[i] !== '') {
				$("#search-container .textbox li:last").before('<li class="tag"><span>' + tags[i] + '</span><a></a></li>');
			}
			//alert($("#search-container .textbox").get(0)); //.before('<li class="tag"><span>' + tags[i] + '</span><a></a></li>');;
		}
		//rebind events because bindings are lost because of navigation
		//Tagshot.views.gallery.delegateEventsToSubViews();
		//Tagshot.views.gallery.delegateEvents();

		$("#gallery").show();
		$("#detail").hide();
	},
	page: function(page) {
		console.log("page: ", page);
	},
	searchpage: function(query, page) {
		console.log("searchpage: "+query+" "+page);
	},
	details: function(id) {
		console.log("navigate:details "+id);

		var self = this;
		var model = Tagshot.collections.photoList.get({"id":id});
		if (model === undefined) {
			console.log("model not yet loaded: "+ id);
			Tagshot.collections.photoList.fetch({
				url:"/photos/"+id,
				add: true,
				success: function(){
					self.details(id);
				}
			});
			return;
		}
		
		//Tagshot.views.detail = new Tagshot.Views.DetailListView({'model': model});
		Tagshot.views.detail.render(model);
		
		$("#backbone-detail-view").show();
		$("#backbone-gallery-view").hide();

		Tagshot.views.detail.delegateEvents();

		// fix for crappy webkit that can't change 
		// display of elements that are not in the dom
		$('footer:first').show();
	}
});
