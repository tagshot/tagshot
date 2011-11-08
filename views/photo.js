// depends on App.collections.photoList

between = function(a,b,c) {
	var max = _.max([a,b]);
	var min = _.min([a,b]);
	return (min <= c && c <= max && c!=a);
}

$(function () {
	var gallery = App.views.PhotoListView.prototype;
	$(document).bind('keydown', 'ctrl+a', gallery.selectAll);
	$(document).bind('keydown', 'meta+a', gallery.selectAll);
});

App.views.PhotoListView = Backbone.View.extend({
	tagName:  "ul",
	className: "image-list-view",
	initialize: function(options) {
			var self = this;
			$(document).bind('keydown', 'ctrl+a', function(){self.selectAll(self); return false;});
			$(document).bind('keydown', 'cmd+a', function(){self.selectAll(self); return false;});
	},
	render: function() {
			console.log("render whole gallery");
			var renderedPhotos = _.map(this.collection.models, function (photo) {
					return new App.views.PhotoView({model : photo}).render().el;
			})
			$(this.el).html(renderedPhotos);
			$('#backbone-image-list-anchor').html(this.el).children("ul").append("<span class='ui-helper-clearfix'>");
			return this;
	},
	events: {
		"click" : "deselectAll"
	},
	selectAll: function(){
		self = App.collections.photoList;
		_.map(self.models, function(item){item.set({"selected": true})});
	},
	deselectAll: function(e){
		console.log(this);
		_.map(this.collection.models, function(item){item.set({"selected": false})});
	}
});

App.views.PhotoView = Backbone.View.extend({
		tagName:  "li",
		className: "image-view",
		initialize : function() {
				this.model.bind('change', this.render, this);
				this.model.bind('destroy', this.remove, this);
		},
		render: function () {
				console.log("render");
				console.log(this);
				// tmpl im index.html
				$(this.el).html(Mustache.to_html($('#image_tmpl').html(), this));

				//make resize of images
				resizeImages();
				return this;
		},
		starHTML: function(){
			return function(text, render) {
				/*var stars = render(text).split("/");
				var blacks = parseInt(stars[0]);
				var whites = parseInt(stars[1]) - blacks;*/
				var blacks = this.model.get("iptc").stars.nr;
				var whites = this.model.get("iptc").stars.of - blacks;

				var blackstar = "<a href='#'>&#9733;</a>";
				var whitestar = "<a href='#'>&#9734;</a>";

				var buildString = function(star, count) {
					starString = "";
					for(var i=0; i<count; i++) {
						starString = starString + " " + star;
					};
					return starString;
				};

				var blackstars = buildString(blackstar, blacks);
				var whitestars = buildString(whitestar, whites);

				return blackstars+whitestars;
			}
		},
		isSelected: function() {
        	return this.model.get("selected");
    	},
		events: {
			"click" : "click",
			"dblclick" : "open"
		},
		open : function() {
			// TODO enlarge image
		},
		remove: function() {
			$(this.el).remove();
		},
		click: function(e) {
			e.stopPropagation();
			// shift -> from..to select
			if (e.shiftKey) {
				var self = this;
				var selected = _.filter(this.model.collection.models, function(item){ return between(LastSelected.id,self.model.id,item.id)});
				_.map(selected, function(item){item.set({"selected": true})});
    		} else {
				LastSelected = this.model;
				_.map(this.model.collection.models, function(item){item.set({"selected": false})});
				this.model.set({"selected": true});
			}
		},
});

/*
http://liquidmedia.ca/blog/2011/01/an-intro-to-backbone-js-part-2-controllers-and-views/

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
				initialize : function(options) {
					console.log("init von photo");
					this.model = options.model;

   					//this.render = _.bind(this.render, this);
 
    				//this.model.bind('change:name', this.render);

					//this.model.bind('change', this.render, this);
				  	//this.model.bind('destroy', this.remove, this);
  				},
				events: {
				  "click .icon": "open"
				},
				render: function() {
				  console.log("render");
				  //$(this.el).html(Mustache.to_html(template, view)); //this.model.toJSON()
				  this.el.innerHTML = this.model.get('name');
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
		PhotosView = Backbone.View.extend({
				//statsTemplate: _.template($('#stats-template').html()),
				//events: {
				//},
				initialize: function(options) {
					var self = this;
    				this._photoViews = [];
 					
					this.collection = options.collection;

					this.collection.each(function(elem){
							console.log(elem);
							//self._photoViews.push(new PhotosView(elem));
							self._photoViews.push(new PhotoView({
									model : elem,
									tagName : 'div'
							}));
					});

					/*this.collection.models.each(function(photo) {
					  self._photoViews.push(new PhotoView({
						model : photo,
						tagName : 'div'
					  }));
					});
				},
				render: function() {
					var that = this;
					// Clear out this element.
					$(this.el).empty();

					console.log(this._photoViews);
				 
					// Render each sub-view and append it to the parent view's element.
					_(this._photoViews).each(function(dv) {
						$(that.el).append(dv.render().el);
					});
				},
		});

		// fetch and init
		Photos.fetch({
				success: function(){
						console.log(Photos);
						App = new PhotosView({collection: Photos, el: $("#image-view")});
						App.render();
				}, 
				error: function(){
						console.log("error")
				}
		});

});*/
