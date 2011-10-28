/*
 * textboxFocusOnStart: a jquery-plugin
 * Given a <input type='text'>-Textbox, this plugin make the textbox autofocus on start,
 * along with displaying a certain 'Search me'-text as long as nothing is entered.
 */
(function ($) {
	$.fn.tagAutocomplete = function (options) {
		// standard settings
		var settings = {
			autocompleteList: [],
			inputCssClass: 'textbox'
		};
		// merge given options into standard-settings
		$.extend(settings, options);

		var parent = this.parent();
		$("<ul />").addClass(settings.inputCssClass).append(this).prependTo(parent);

		this.keypress(function (event) {
			if (event.keyCode === 32) {
			}
		});

		return this;
	};
}(jQuery));
