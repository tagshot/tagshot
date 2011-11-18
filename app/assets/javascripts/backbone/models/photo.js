Tagshot.Models.ErrorHandlingModel = Backbone.Model.extend({
	initialize: function(attributes, options) {
		options || (options = {});
		this.bind("error", this.defaultErrorHandler);
		this.init && this.init(attributes, options);
	},
	defaultErrorHandler: function(model, error) {
		console.error(error.statusText,error);
		if (error.status == 401 || error.status == 403) {
			// trigger event or route to login here.
		} else {
			alert("Status code: " + error.status + "\n" + error.statusText);
		}
	}
});

Tagshot.Models.Photo = Tagshot.Models.ErrorHandlingModel.extend({
	initialize: function(options) {
		Tagshot.Models.ErrorHandlingModel.prototype.initialize.call(this, options);
	},
	defaults: function() {
		return {
			id: 0,
			selected: false
		};
	},
	star: function(nr, of) {
		// TODO
	},
	isSelected: function() {
		return this.get("selected");
	},
	select: function() {
		this.set({"selected": true});
	},
	deselect: function() {
		this.set({"selected": false});
	},
	toggleSelect: function() {
		self = this;
		this.set({"selected": !self.get("selected")});
	}

});
