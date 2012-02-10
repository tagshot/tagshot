/* This model describes a photo
 * ================================================================================
 * The select/deselect/isSelected stuff helps to select multiple
 * photos for batch processing in the photo.list.view. It is not saved 
 * to the attributes (with backbone's set()/ save()) because we don't want 
 * it to be send to the backend
 *
 * A photo is part of the collection Tagshot.Collections.PhotoList. 
 *
 * One can add tags to all or delete all the selected photos.
 */

Tagshot.Models.Photo = Backbone.Model.extend({
	collection: Tagshot.Collections.PhotoList,
	paramRoot: "photo",

	initialize: function() {
		_.bindAll(this);
	},

	order: function() {
		return this.id;
	},

	selected: false,
	defaults: {
		id: 0
	},

	select: function (silent) {
		if (this.selected || silent) return;
		this.selected = true;
		this.trigger("select", this);
	},

	deselect: function(silent) {
		if (!this.selected) return;
		this.selected = false;
		if (!silent)
			this.trigger("deselect");
	},

	toggleSelect: function() {
		this.selected ? this.deselect() : this.select();	
	}
});
