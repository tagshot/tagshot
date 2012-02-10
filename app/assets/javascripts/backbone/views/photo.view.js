/* This view displays the information defined in photo.js.
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
	tagName:          "li",
	className:        "image-view",
	templateSelector: '#image-template',
	events: {
		"click img":            "click",
		"dblclick img":         "openDetails",
		"keydown[space]":       "quickview",
		"keydown[return]":      "openDetails",
		"keydown[shift+left]":  "shiftSelectPrevious",
		"keydown[shift+right]": "shiftSelectNext",
		"keydown[left]":        "selectPrevious",
		"keydown[right]":       "selectNext",
		"keydown[up]":          "selectAbove",
		"keydown[down]":        "selectBelow",
		"keydown[del]":         "delete",
		"focusin":              "photoFocused"
	},

	photoFocused: function (event) {
		if (Tagshot.collections.photoList.selection().length === 0) {
			this.model.select();
		}
	},
	initialize : function() {
		_.bindAll(this);

		// registering event handlers
		this.model.bind('change:thumb', this.render);
		this.model.bind('change:tags', this.tagChange);
		this.model.bind('destroy', this._remove);
		this.model.bind('select', this.select);
		this.model.bind('deselect', this.deselect);
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
		$(this.el).children('.image-frame').focus();
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

	quickview: function(e) {
		this.stop(e);
		this.trigger('quickview', this);
		return false;
	},
	

	_remove: function() {
		//should get called when destroy() was called b.c. of event binding in initialize()
		this.remove();	// equivalent to $(this.el).remove()
	},

	delete: function() {
		var selected = this.model.collection.selection();
		var that = this;

		_.each(selected, function(elem){
				elem.destroy({
					error: function(model, err) {
						console.log('DELETE abortet with model:', model, 'Status:', err.status);
					}
				});
		});
	},

	click: function (e) {
		this.stop(e);
		$(this.el).find('.image-frame').focus();
		Tagshot.views.gallery.setActive();
		
		this.model.trigger('changeSelection', this.model, e.shiftKey, e.ctrlKey || e.metaKey);
	},

	stop: function (e) {  
		//avoid propagation to underlying view(s)
		e.stopPropagation();
	},

	selectNext: function (e) {
		this.stop(e);
		this.model.trigger('selectNext');
	},
	selectPrevious: function (e) {
		this.stop(e);
		this.model.trigger('selectPrevious');
	},
	selectAbove: function (e) {
		this.stop(e);
		var imagesInRow = this.countImagesInARow();
		this.model.trigger('selectAbove', imagesInRow);
	},
	selectBelow: function (e) {
		this.stop(e);
		var imagesInRow = this.countImagesInARow();
		this.model.trigger('selectBelow', imagesInRow);
	},
	shiftSelectNext: function (e) {
		this.stop(e);
		this.model.trigger('shiftSelectNext');
	},
	shiftSelectPrevious: function (e) {
		this.stop(e);
		this.model.trigger('shiftSelectPrevious');
	},
	countImagesInARow: function () {
		var offset, count = 0;
		$(".image-view .image").each(function (index, el) {
			if (offset === undefined) {
				offset = $(el).offset().top;
			} else {
				if (offset !== $(el).offset().top)
					return false;
			}
			count += 1;
		});
		return count;
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
