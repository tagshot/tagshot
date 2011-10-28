(function ($) {
	var autoCompleteListId = 0;
	$.fn.tagAutocomplete = function (options) {
		// standard settings
		var settings = {
			autocompleteList: [],
			autocompleteCssClass: 'autocompletion-list',
			inputCssClass: 'textbox'
		},
		    that = this,
		    parent = this.parent(),
		    offset = this.offset(),
		    height = this.outerHeight(),
		    width = this.outerWidth(),
		    listId = "autocompletion-list" + autoCompleteListId,
		    lowercase;

		// merge given options into standard-settings
		$.extend(settings, options);

		lowercase = settings.autocompleteList.map(function (el) {
			return el.toLowerCase();
		});

		$("<ul />").addClass(settings.inputCssClass).append(this).prependTo(parent);
		$("<ul class='" + settings.autocompleteCssClass + "' id='" + listId + "'><li>test</li></ul>")
			.appendTo("body")
			.css("position", "absolute")
			.css("top", offset.top + height + 5)
			.css("left", offset.left)
			.css("z-index", "999")
			.css("width", width + "px");

		this.keydown(function (event) {
			
		}).keyup(function (event) {
			var text = this.value.toLowerCase(),
			    filteredList = lowercase.filter(function (el, index) {
			    	var regex = new RegExp("^" + text);
			    	return el.search(regex) >= 0;
			    });
			    $("#" + listId).html(filteredList.reduce(function (prev, current) {
			    	return prev + "<li>" + current + "</li>";
			    }, ""));
			if (event.keyCode === 32) {
				alert("test");
			}
		});

		return this;
	};
}(jQuery));
