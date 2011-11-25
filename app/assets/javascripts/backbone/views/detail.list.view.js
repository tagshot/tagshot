Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "div",
	className: "detail",
	events: {
		"click" : "click"
	},
	initialize: function(options) {
		//initial fetch
		//this.collection.fetch();
	},
	render: function() {
		console.log("render detailed view");
		$(this.el).html(Mustache.to_html($('#detail-list-template').html(), this));
		this.collection.each(this.append);
		return this;
	},
	click: function(){
		alert("click");
	}
});
