/* This model describes a photo
 * The select/deselect/isSelected stuff helps to select multiple
 * photos for batch processing in the photo.list.view.
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

	computeHash: function() {
		return $.param({
			id: this.id,
			caption: this.caption,
			tags: this.tags,
			rating: this.rating
		})
	},
	selected: false,
	defaults: {
		id: 0
	},

	select: function() {
		if (this.selected) return;
		this.selected = true;
		this.trigger("select", this);
	},

	deselect: function() {
		if (!this.selected) return;
		this.selected = false;
		this.trigger("deselect");
	},

	toggleSelect: function() {
		this.selected? this.deselect() : this.select();	
	}
});
