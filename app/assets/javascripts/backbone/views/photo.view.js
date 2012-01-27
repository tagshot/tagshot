//= require backbone-eventdata

Tagshot.Views.PhotoView = Backbone.View.extend({
	tagName:  "li",
	className: "image-view",
	events: {
		//"click .star-me" : "click",
		"click" : "click",
		"dblclick" : "openDetails",
		"keydown[space]" : "quickview",
		"keydown[return]" : "openDetails",
		"keydown[left]" : "gotoPrevious",
		"keydown[right]" : "gotoNext",
		"keydown[tab]" : "gotoNext",
		"keydown[del]": "delete",
	},

	initialize : function() {
		_.bindAll(this);

		this.model.bind('change:thumb', this.render, this);
		this.model.bind('change:tags', this.tagChange, this);
		this.model.bind('destroy', this._remove, this);
		this.model.bind('select', this.select, this);
		this.model.bind('deselect', this.deselect, this);
		this.quickViewVisible = false;
	},

	render: function () {
		// caching magic
		if (this.needsNoRender()) {
			return this;
		}
		this.fillTemplate();
		resizeImages();
		this.setStars();

		//delegate events means rebinding the events
		this.delegateEvents();
		return this;
	},

	rating: function(stars) {
		this.model.save({'properties' : {'rating' : stars}});
	},

	tagChange: function () {
		var s = this.model.get("tags").join(", ");
		$(this.el).find(".tags").html(s);
	},

	select: function() {
		$(this.el).children().first().addClass("selected");
		this.trigger("selectionChanged");
	},

	deselect: function() {
		$(this.el).children().first().removeClass("selected");
		this.trigger("selectionChanged");
	},

	isSelected: function() {
		return this.model.selected;
	},

	openDetails : function(e) {
		Tagshot.router.navigate("details/" + this.model.get("id"), true);
	},

	quickview: function(e){
		this.stop(e);

		if (this.quickViewVisible) {
			$.fancybox.close();
			this.quickViewVisible = false;
		} else {
			this.quickViewVisible = true;
			$.fancybox({
				'orig' : $(this.el).find('img'),
				'href' : $(this.el).find('img').attr('src'),
				'padding' : 0,
				'speedIn' :	200,
				'speedOut' :	200,
				'title' : this.model.get('tags'),
				'transitionIn' : 'elastic',
				'transitionOut' : 'elastic'
			}); 
		}
	},
	

	_remove: function() {
		//should get called when destroy() was called b.c. of event binding in initialize()
		this.remove();	// equivalent to $(this.el).remove()
	},

	delete: function() {
		var selected = this.model.collection.selection();
		var that = this;
		//this.model.destroy();

		//this.remove();	// works only for one element, not for all selected

		_.each(selected, function(elem){
				elem.destroy({
					error: function(model, err) {
						console.log('DELETE abortet with model:', model, 'Status:', err.status);
					}
				});
		});
	},

	click: function(e) {
		this.stop(e);
		$(this.el).find('.image-frame').focus();
		if (e.shiftKey) {
			// shift -> from..to select
			var self = this;
			this.model.collection.selectFromTo(LastSelected, this.model);
		} else if (e.ctrlKey || e.metaKey) {
			// ctrl toggle this selection
			var self = this;
			LastSelected = this.model;
			this.model.toggleSelect();
		} else {
			// deselect all but current
			LastSelected = this.model;
			this.model.collection.deselectAll({'exclude':this.model});
			this.model.select();
		}
	},

	stop: function(e) {  
		//avoid propagation to underlying view(s)
		e.stopPropagation();
	},

	gotoNext: function(e) {
		this.stop(e);
		$(this.el).next().find('.image-frame').focus();
	},

	gotoPrevious: function() {
		$(this.el).prev().find('.image-frame').focus();
	},

	fillTemplate: function() {
		$(this.el).html(Mustache.to_html($('#image-template').html(), this));
	},

	setStars: function() {
		var stars = this.model.get('properties').rating;
		$(this.el).find(".star-me").starMe({
			'starCount': stars,
			'ratingFunc': this.rating
		});
	},

	needsNoRender: function() {
		var currentModelHash = this.model.computeHash();
		if (this.model.hash === currentModelHash) {
			return true;
		}
		console.log("identifier change: " + this.model.hash + " -> " + currentModelHash);
		this.model.hash = currentModelHash;
		return false;
	}
});
