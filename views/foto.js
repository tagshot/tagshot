$(function(){

		var view = {
				title: "Joe",
calc: function() {
		return 2 + 4;
}
}

var template = "{{title}} spends {{calc}}";

// one photo
PhotoView = Backbone.View.extend({
		//template: _.template($('#item-template').html()),
		initialize: function() {
				this.model.bind('change', this.render, this);
				this.model.bind('destroy', this.remove, this);
		},
		  events: {
				  "click .icon": "open"
		  },
		  render: function() {
				  console.log("render");
				  $(this.el).html(Mustache.to_html(template, view)); //this.model.toJSON()
				  return this;
		  },
		  remove: function() {
				  $(this.el).remove();
		  },
		  select: function() {
				  $(this.el).addClass("selected");
		  },
		  deselect: function() {
				  $(this.el).removeClass("selected");
		  }
});

// whole gallery
window.AppView = Backbone.View.extend({
		el: $("#image-view"),
		//statsTemplate: _.template($('#stats-template').html()),
		events: {

		},
		initialize: function() {
				console.log("app init");
				this.render();
		},
		render: function() {
				console.log("app render");
				console.log(collection);
				var html = "empty";
				collection.models.forEach(function(photoModel) {
						var view = new PhotoView({model: photoModel});
						html.append(view.render());
				});
				this.el.html(html);
		},
});

// fetch and init
Photos.fetch({
		success: function(){
			collection = Fotos;
			window.App = new AppView({collection: collection});
		}, 
		error: function(){
				console.log("error")
		}
});

});
