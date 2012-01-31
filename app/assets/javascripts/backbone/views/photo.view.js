/* This view displays the information defined in poto.js.
 *
 * It is responsible for setting up plugins that manipulate the DOM,
 * do the selection magic and add fancy effects.
 *
 * It also captures user input and saves it into the model.
 *
 * It's HTML template is located in app/views/moustache/image.html
 */


//= require backbone-eventdata

Tagshot.Views.PhotoView = Tagshot.AbstractPhotoView.extend({
	tagName:  "li",
	className: "image-view",
	templateSelector: '#image-template',
	events: {
		"click img" : "click",
		"dblclick img" : "openDetails",
		"keydown[space]" : "quickview",
		"keydown[return]" : "openDetails",
		"keydown[left]" : "gotoPrevious",
		"keydown[right]" : "gotoNext",
		"keydown[del]": "delete",
		"focusin": "photoFocused"
	},

	photoFocused: function (event) {
		if (Tagshot.collections.photoList.selection().length === 0) {
			this.model.select();
		}
		else {
			window.scrollTo(0, 0);
		}
	},
	initialize : function() {
		_.bindAll(this);

		// registering event handlers
		this.model.bind('change:thumb', this.render, this);
		this.model.bind('change:tags', this.tagChange, this);
		// this.model.bind('change:select', this.select, this);
		this.model.bind('destroy', this._remove, this);
		this.model.bind('select', this.select, this);
		this.model.bind('deselect', this.deselect, this);
		quickViewVisible = false;
	},

	render: function () {
		// caching magic
		if (this.needsNoRender()) {
			return this;
		}
		this.fillTemplate(this.templateSelector);
		this.setStars();

		Tagshot.helpers.resizeImages();

		// delegate events means rebinding the events
		this.delegateEvents();
		return this;
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
		if (!quickViewVisible) {
			Tagshot.router.navigate("details/" + this.model.get("id"), true);
		}
	},

	quickview: function(e, override) {
		override || (override = false);
		this.stop(e);

		if (!override && quickViewVisible) {
			$.fancybox.close();
		} else {
			$.fancybox.hideActivity();
			$.fancybox({
				'orig' : $(this.el).find('img'),
				'href' : $(this.el).find('img').attr('src'),
				'padding' :		0,
				'speedIn' :		200,
				'speedOut' :	200,
				'changeSpeed':	0,
				'changeFade':	0,
				'onStart': function(){quickViewVisible = true},
				'onClosed': function(){quickViewVisible = false},
				'title' :		this.model.get('tags'),
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

		//this.remove();	// works only for one element, not for all selected ones

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
		Tagshot.views.gallery.setActive();
		
		// show this image in quickview in case quickview is visible
		if (quickViewVisible) {
			this.quickview(e, true);
		}
		
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
		$(this.el).next().find('img').click();
	},

	gotoPrevious: function() {
		$(this.el).prev().find('img').click();
	},

	needsNoRender: function() {
		var currentModelHash = this.model.computeHash();
		if (this.model.hash === currentModelHash) {
			return true;
		}
		//console.log("identifier change: " + this.model.hash + " -> " + currentModelHash);
		this.model.hash = currentModelHash;
		return false;
	}
});
