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
	},
	fallback: function(foo) {
		console.log("foo: ",foo);
	}
});
