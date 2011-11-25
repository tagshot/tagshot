Tagshot.Models.Photo = Backbone.Model.extend({
	initialize: function(options) {
		Tagshot.Models.ErrorHandlingModel.prototype.initialize.call(this, options);
	},
	selected: false,
	defaults: function() {
		return {
			id: 0
		};
	},
	isSelected: function() {
		return this.selected;
	},
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
