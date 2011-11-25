Tagshot.Views.DetailListView = Backbone.View.extend({
	tagName:  "div",
	className: "detail",
	events: {
		"click" : "click"
	},
	initialize: function(options) {
		_.bindAll(this, "render");

		_.bind("change", this.render, this);
	},
	render: function(model) {
		console.log("render detailed view", model);
		$(this.el).html(Mustache.to_html($('#detail-list-template').html(), model));
		return this;
	},
	click: function(){
		alert("click");
	}
});
