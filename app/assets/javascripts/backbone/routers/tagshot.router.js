Tagshot.Router = Backbone.Router.extend({

	routes: {
		"":							"home",
		"search/:query":			"search",	//search/hasso
		"p:page":					"page",
		"search/:query/p:page":		"searchpage",
		"details/:id":				"details",
		"*foo":						"fallback"
	},
	home: function() {
		console.log("home");
	},
	search: function(query) {
		console.log("search: ", query);
	},
	page: function(page) {
		console.log("page: ", page);
	},
	searchpage: function(query, page) {
	},
	details: function(id) {
		console.log("details: ", id);
	},
	fallback: function(foo) {
		console.log("foo: ",foo);
	}
});
