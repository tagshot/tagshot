/*
 * =======================
 * TagAutocomplete
 * =======================
 * This plugin adds autocomplete features to a given <input type='text'>-Textbox.
 * Furthermore, it recognizes tags and displays them in nice way.
 * To achieve this, it uses the following markup:
 * Markup before plugin is applied:
 * <input type='text' class='textbox-style' value='Test' />
 * Markup afterwards (also added to recognized tags):
 * <ul class='textbox-style'>
 * 	<li>Recognized Tag 1</li>
 * 	<li>Recognized Tag 2</li>
 * 	<li><input type='text' value='Test'></li>
 * </ul>
 * This list is refered to as 'tag list' in the following.
 * In addition, a list for autocompletion is added to the body:
 * <ul id='autocompletion-list-0>
 * </ul>
 * This list is refered to as 'autocompletion list' in the following.
 */
(function ($) {
	"use strict";
	// id counter, to create unique id's when there is more than one <input>-element given.
	var autoCompleteListId = 0;
	$.fn.tagAutocomplete = function (options) {
		    // standard settings
		var settings = {
			autocompleteList: [],
			autocompleteCssClass: 'autocompletion-list',
			inputCssClass: 'textbox'
		},
		    // will hold a lowercased-version of settings.autocompleteList
		    lowercase;
		// merge given options into standard-settings
		$.extend(settings, options);

		/*
		 * Create a lowercased version of settings.autocompleteList,
		 * This is needed to be case-insensitive, so typing 'java'
		 * will also find 'Java'.
		 * Input:
		 * [
		 * 	'JavaScript',
		 * 	'Java'
		 * ]
		 * Output:
		 * [
		 * 	'javascript',
		 * 	'java'
		 * ]
		 */
		lowercase = settings.autocompleteList.map(function (el) {
			return el.toLowerCase();
		});

		this.each(function () {
			// javascript note: this now refers to the input dom element

			    // jqueryify dom-element
			var $this = $(this),
			    // now save some element data needed for computation
			    parent = $this.parent(),
			    offset = $this.offset(),
			    height = $this.outerHeight(),
			    width = $this.outerWidth(),
			    // build a unique id for the current element
			    autocompletionListId = 'autocompletion-list-' + autoCompleteListId;

			if (this.tagName.toLowerCase() !== 'input' && $this.attr('type').toLowerCase() !== 'text') {
				console.error('Trying to use tagAutocomplete-Plugin for a non <input type="text" />-field');
				return;
			}
			// increase id counter to create a really unique id next time
			autoCompleteListId += 1;

			// create tag list, add css class from input-field and put <input>-field right into it
			$('<ul />').addClass(settings.inputCssClass).append($this).prependTo(parent);

			// create autocompletion list, add css class, and prepare for positioning later
			$('<ul class="' + settings.autocompleteCssClass + '" id="' + autocompletionListId + '"></ul>')
				.appendTo('body')
				.css('position', 'absolute')
				.css('top', offset.top + height + 5)
				.css('left', offset.left)
				.css('z-index', '999')
				.css('width', width + 'px');

			// now add keyboard monitoring for <input>-element
			$this.keyup(function (event) {
				    // text refers to the <input>'s text _after_ the keystroke
				var text = this.value.toLowerCase(),
				    // filteredList will hold all those entries which match the current search criteria
				    filteredList,
				    // only keep those entries which start with the search string
				    regex = new RegExp('^' + text);

				// at first check, whether there is something to filter ..
				if (text.length === 0) {
					// if not, do not display autocompletion.
					$('#' + autocompletionListId).html('');
					return;
				}

				// catch some special keystrokes
				// for information about which key belongs to which keyCode,
				// see http://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
				if (event.keyCode === 13) {
					alert('enter');
				}
				else if (event.keyCode === 27) {
					alert('escape');
				}
				else if (event.keyCode === 32) {
					alert('space');
				}
				else if (event.keyCode === 37) {
					alert('left arrow');
				}
				else if (event.keyCode === 38) {
					alert('up arrow');
				}
				else if (event.keyCode === 39) {
					alert('right arrow');
				}
				else if (event.keyCode === 40) {
					alert('down arrow');
				}

				// filter list
				filteredList = lowercase.filter(function (el) {
					// true, when something was found (search returns index of first occurrence)
					return el.search(regex) >= 0;
				});

				// as we want to entries in autocomplete list to be displayed in normal case
				// (and not lowercased as the entries in filteredList)
				// we have to find the correct indices for the correct list
				// so we just map each entry to its original position in the array
				filteredList = filteredList.map(function (el) {
					return lowercase.indexOf(el);
				});
				// filteredList is now an array of indices to the entries in settings.autocompleteList

				// display all entries in autocompletion list
				$('#' + autocompletionListId).html(filteredList.reduce(function (prev, current) {
					return prev + '<li>' + settings.autocompleteList[current] + '</li>';
				}, ''));
			});
		});

		// support jquery-chaining
		return this;
	};
}(jQuery));
