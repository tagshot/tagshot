Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "ul",
	className: "detail",
	events: {
		"click" : "click"
	},
	initialize: function(options) {
		//initial fetch
		//this.collection.fetch();
	},
	render: function() {
		console.log("render whole gallery");
		$(this.el).append("<span id='fix-gallery' class='ui-helper-clearfix'>");
		this.collection.each(this.append);
		return this;
	},
	click: function(){
		alert("click");
	}
});
