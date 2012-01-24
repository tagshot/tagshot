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

		//rebind events because bindings are lost beacuse of navigation
		Tagshot.views.gallery.delegateEventsToSubViews();
		Tagshot.views.gallery.delegateEvents();

		$(".detail").hide();
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
		Tagshot.collections.photoList.fetch({
			url:"/photos/"+id,
			append: true,
			success: function(){
				Tagshot.collections.photoList.get({"id":id});
				Tagshot.views.detail.render();
			}
		});
		$(".gallery").hide();
	},
	fallback: function(foo) {
		console.log("foo: ",foo);
	}
});
