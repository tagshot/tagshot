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
		console.log("navigate:home "+foo);
		Tagshot.collections.photoList.fetch({
			data: {limit: 10},
			append: true
		});

		//rebind events because bindings are lost because of navigation
		//Tagshot.views.gallery.delegateEventsToSubViews();
		//Tagshot.views.gallery.delegateEvents();

		$("#backbone-detail-view").hide();
		$("#backbone-gallery-view").show();


		// set focus to search bar
		$('#search-box').focus();

	},

	search: function(query) {
		console.log("search: ", query);
		Tagshot.collections.photoList.search(query);

		//rebind events because bindings are lost because of navigation
		Tagshot.views.gallery.delegateEventsToSubViews();
		Tagshot.views.gallery.delegateEvents();

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

		console.log("details: ", id);
		var model = Tagshot.collections.photoList.get({"id":id});
		if (model == undefined) {
			console.log("not yet defined: "+ id);
			Tagshot.collections.photoList.fetch({
				url:"/photos/"+id,
				append: true,
				success: function(){
					self.details(id);
				}
			});
			return;
		} else {
			//Tagshot.views.detail = new Tagshot.Views.DetailListView({'model': model});
			Tagshot.views.detail.render(model);
		}
		
		$("#backbone-detail-view").show();
		$("#backbone-gallery-view").hide();

		Tagshot.views.detail.delegateEvents();

		//fix for crappy webkit that can't change 
		//dispay of elements that are not in the dom
		//$('footer:first').show();
	}
});
