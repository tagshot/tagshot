/* 
 * This view is used to display a huge single photo with its tags and metadata.
 * ================================================================================  
 * This View works lie the Tagshot.Views.PhotoView. For further details use the 
 * documentation there. 
 *
 * This view is responsible for showing properties and metainformation of the images, 
 * store changes to the properties to the database and allow the user to download images
 * in variour resolutions.
 * 
 * It's HTML template is located in app/views/mustache/detail.html
 */

//=require jquery.starMe
//=require jquery.inlineedit

Tagshot.Views.DetailView = Tagshot.AbstractPhotoView.extend({
	tagName:  "div",
	className: "detail",
	id: "backbone-detail-view",
	templateSelector: '#detail-template',

	events: {
		"click footer" :          "stop",
		"change #tag-box":        "updateTags",
		"submit #download-form":  "download"
	},

	initialize: function(options) {
		_.bindAll(this);
	},

	render: function (model) {
		if (!model) {
			this.renderNotFound();
			return;
		}
		this.model = model;

		// set model as selected so that we can tag it and so on
		this.model.select(true);

		var tags = {tags: this.model.get('tags')};

		this.fillTemplate(this.templateSelector);
		this.setStars();
		this.bindInputListener();

		return this;
	},

	metaHTML: function() {
		return function(text, render) {
			var str = '';
			var metadata = this.model.get("meta");
			$.each(metadata, function(key, value) {
				str += '<span class="def-item"><dt>' + key + '</dt><dd>' + value + '</dd></span>';
			});
			return str;
		};
	},

	bindInputListener: function() {
		this.bindSave('.prop dd input');
		this.bindSave('.prop dd textarea');
		this.setFocusIfEmpty('.prop dd input:first');
	},

	bindSave: function(selector) {
		var self = this;
		$(selector).blur(function() {
			var key = $(this).attr('data-key');
			self.saveProperty(key, $(this).val());
		});
	},

	saveProperty: function(key, value) {
		var props = this.model.get('properties');
		props[key] = value;
		this.model.save({'properties': props});
	},

	setFocusIfEmpty: function(selector) {
		if ($(selector).val() === '') {
			$(selector).focus();
		}
	},

	updateTags: function(e) {
		var tags = $(Tagshot.ui.selectors.tagBox).val().split(" ")
		this.model.save({'tags': tags});
	},

	download: function(e) {
		stop(e);
		var res = $('#download-res', this.el).val();
		var scaled = $('input[name=download-scaled]:checked', this.el).val();
		var x = res.split("×")[0];
		var y = res.split("×")[1];

		if (res === "orig") {
			window.open("/photos/"+this.model.id+".jpg");
		} else {

			// easter egg
			if (res === "9600×7200"){
				window.open("http://images.cheezburger.com/completestore/2011/4/11/cf9b5c92-a024-413b-bb8e-2a60c9c2875a.jpg");
				return false;
			}

			// build url
			var url = "/photos/"+this.model.id+"/download/"+x+"/"+y+"/"+scaled+"/"+this.model.id+"_"+x+"x"+y+".jpg";

			console.log("download", url);
			window.open(url);
		}

		return false;
	},

	renderNotFound: function() {
		$(this.el).html("Image not found");
	}
});
