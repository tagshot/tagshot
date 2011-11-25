Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "div",
	className: "detail",
	events: {
		"click" : "click"
	},
	initialize: function(options) {
		_.bindAll(this, "render");

		this.render();
	},
	render: function() {
		console.log("render detailed view");
		$(this.el).html(Mustache.to_html($('#detail-list-template').html(), this));
		return this;
	},
	click: function(){
		alert("click");
	}
});
