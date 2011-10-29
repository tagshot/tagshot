App.views.PhotoListView = Backbone.View.extend({
		initialize: function(options) {
				var self = this;

		},
		render: function() {
				var renderedArticles = _.map(this.collection.models, function (article) {
						return new App.views.ArticleView({model : article}).render().el;
				})
				$(this.el).html(renderedArticles);
				$('#backbone-image-list-anchor').html(this.el);
				return this;
		}
});

App.views.ArticleView = Backbone.View.extend({
		initialize : function() {
				this.model.bind('change:name', this.render);
				this.model.bind('destroy', this.remove);
		},
		render : function () {
				$(this.el).html(Mustache.to_html(template, this.model));
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


var template = '<button type="button"><img src="{{attributes.thumb}}" /><div class="star-me">{{#starHTML}}{{attributes.iptc.stars.nr}}/{{attributes.iptc.stars.of}}{{/starHTML}}</div><div class="tags">{{attributes.iptc.tags}}</div></button>';

/*$(function(){

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
