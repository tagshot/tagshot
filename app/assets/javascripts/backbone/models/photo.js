//=require deep-model

Tagshot.Models.Photo = Backbone.DeepModel.extend({
	paramRoot: "photo",
	initialize: function() {
		//_.bindAll(this, 'order', 'isSelected');
	},
	order: function() {
		return this.id;
	},
	selected: false,
	defaults: function() {
		return {
			id: 0
		};
	},
	isSelected: function() {
		return this.selected;
	}(),
	select: function() {
		if (!this.selected) {
			this.selected = true;
			this.trigger("select");
		}
	},
	deselect: function() {
		if (this.selected) {
			this.selected = false;
			this.trigger("deselect");
		}
	},
	toggleSelect: function() {
		this.selected? this.deselect() : this.select();	
	}

});
