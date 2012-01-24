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
		"*foo":						"fallback"
	},

	home: function() {
		console.log("home");
		Tagshot.collections.photoList.fetch({
			data: {limit: 10},
			append: true
		});

		//rebind events because bindings are lost because of navigation
		Tagshot.views.gallery.delegateEventsToSubViews();
		Tagshot.views.gallery.delegateEvents();

		$("#gallery").show();
		$("#detail").hide();

		// set focus to search bar
		$('#search-box').focus();

	},

	search: function(query) {
		console.log("search: ", query);
		Tagshot.collections.photoList.search(query);
	},
	page: function(page) {
		console.log("page: ", page);
	},
	searchpage: function(query, page) {
		console.log("searchpage: "+query+" "+page);
	},
	details: function(id) {
		console.log("details: ", id);
		if (Tagshot.collections.photoList.get({"id":id}) === undefined) {
			Tagshot.collections.photoList.fetch({
				url:"/photos/"+id,
				append: true,
				success: function(){
					Tagshot.collections.photoList.mainModel = Tagshot.collections.photoList.get({"id": id});
					Tagshot.views.detail.render();
				}
			});
		} else {
			Tagshot.views.detail.render();
		}
		$("#detail").show();
		$("#gallery").hide();

		//fix for crappy webkit that can't change 
		//dispay of elements that are not in the dom
		//$('footer:first').show();
	},
	fallback: function(foo) {
		console.log("foo: ",foo);
	}
});
