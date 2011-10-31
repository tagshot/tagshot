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
	var autoCompleteListId = 0,
	// for information about which key belongs to which keyCode,
	// see http://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
	    keyCodes = {
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		SHIFT: 16,
		CONTROL: 17,
		ESCAPE: 27,
		SPACE: 32,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		DELETE: 46
	};

	$.fn.tagAutocomplete = function (options) {
		    // standard settings
		var settings = {
			// list of possible autocompletions
			autocompleteList: [],
			// css class for the autocompletion list
			autocompleteCssClass: 'autocompletion-list',
			// css class for the <input>-element,
			// will be applied to the surrounding <ul> during the plugin-process (see above for explanation)
			inputCssClass: 'textbox',
			// the maximum number of entries to be displayed while autocompletion
			maxEntries: 10
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
			    // save jqueryfied references to tag- and autocompletion-list
			    $tagList,
			    $autocompletionList,
			    // save the entries currently displayed in autocompletion
			    entriesList,
			    // now save some element data needed for computation
			    parent = $this.parent(),
			    offset = $this.offset(),
			    height = $this.outerHeight(),
			    width = $this.outerWidth(),
			    // build a unique id for the current element
			    autocompletionListId = 'autocompletion-list-' + autoCompleteListId,
			    selectedEntry = null;

			var displayAutocompletionList = function () {
				// display all entries in autocompletion list
				$autocompletionList.html(entriesList.reduce(function (prev, current) {
					var selected = current === selectedEntry ? ' class="selected"' : '';
					return prev + '<li' + selected + '>' + current + '</li>';
				}, ''));
			}


			// exit, if the current element is not a <input type="text" />
			if (this.tagName.toLowerCase() !== 'input' && $this.attr('type').toLowerCase() !== 'text') {
				console.error('Trying to use tagAutocomplete-Plugin for a non <input type="text" />-field - Fail!');
				return;
			}
			// increase id counter to create a really unique id next time
			autoCompleteListId += 1;

			// create tag list, add css class from input-field and put <input>-field right into it
			$tagList = $('<ul />').addClass(settings.inputCssClass).append($this).prependTo(parent);

			// create autocompletion list, add css class, and prepare for positioning later
			$autocompletionList = $('<ul class="' + settings.autocompleteCssClass + '" id="' + autocompletionListId + '"></ul>')
				.appendTo('body')
				.css('position', 'absolute')
				.css('top', offset.top + height + 5)
				.css('left', offset.left)
				.css('z-index', '999')
				.css('width', width + 'px');

			/*
			 * Keyboard-monitoring
			 * This is a rather painful task in javascript.
			 * There are three possible events:
			 *  - keydown
			 *  - keyup
			 *  - keypress
			 * Keypress does not reliably works in firefox, so it cannot be used.
			 * Keydown is released before, the focused element processes to input,
			 *   so there is now way to get the result of the keystroke (e.g. a text
			 *   change in midword). The event-object does not hold no useful cross-
			 *   browser information, so keydown cannot be used either.
			 * Keyup, on the other hand, is released after processing the input, so 
			 *   you can access the changed text, but thats the problem, when you don't
			 *   want it to be processed - e.g. when the user pressed the left-arrow-key
			 *   and you want a special routine for that without moving the cursor.
			 *
			 * So - as the following code needs both the changed text _and_ the possibily
			 * prevent default behaviour - a workaround is needed:
			 * The keyc------------------------------------------------------------------------------------------------tobecommented
			 *
			 * Another way - which is used by jQuery-UI-autocomplete, - is to set a timeout
			 * (using window.setTimeout) in the keyDown event with a delay of 300 ms.
			 * But as we want this plugin to be really fast and reactive, this was no
			 * choice for us.
			 */

			// now add keyboard monitoring for <input>-element
			$this.keydown(function (event) {
				var doNothing = function () { };
				switch (event.keyCode) {
					case keyCodes.LEFT:
						break;
					case keyCodes.DOWN:
						var index = entriesList.indexOf(selectedEntry);
						selectedEntry = entriesList[Math.min(index + 1, entriesList.length - 1)];
						$autocompletionList.children('li').removeClass('selected');
						displayAutocompletionList(entriesList, $autocompletionList);
						event.preventDefault();
						break;
					case keyCodes.UP:
						var index = entriesList.indexOf(selectedEntry);
						selectedEntry = entriesList[Math.max(index - 1, 0)];
						$autocompletionList.children('li').removeClass('selected');
						displayAutocompletionList(entriesList, $autocompletionList);
						event.preventDefault();
						break;
						
				}
			}).keyup(function (event) {
				    // text refers to the <input>'s text _after_ the keystroke
				var text = this.value.toLowerCase(),
				    // filteredList will hold all those entries which match the current search criteria
				    filteredList,
				    // will save whether the autocompletion is displayed or not
				    autocompletionDisplayed = false,
				    // only keep those entries which start with the search string
				    regex = new RegExp('^' + text);

				// at first check, whether there is something to filter ..
				if (text.length === 0) {
					// if not, do not display autocompletion.
					$('#' + autocompletionListId).html('');
					return;
				}

				// catch some special keystrokes
				if (event.keyCode === keyCodes.BACKSPACE) {
					selectedEntry = null;
				}
				else if (event.keyCode === keyCodes.ENTER) {
					alert('enter');
				}
				else if (event.keyCode === keyCodes.ESCAPE) {
					alert('escape');
				}
				else if (event.keyCode === keyCodes.SPACE) {
					alert('space');
				}
				else if (event.keyCode === keyCodes.LEFT) {
					alert('left arrow');
					event.preventDefault();
				}
				else if (event.keyCode === keyCodes.UP) {
				}
				else if (event.keyCode === keyCodes.RIGHT) {
					alert('right arrow');
				}
				else if (event.keyCode === keyCodes.DOWN) {
				}

				// filter list
				filteredList = lowercase.filter(function (el) {
					// true, when something was found (search returns index of first occurrence)
					return el.search(regex) >= 0;
				});

				// limit to settings.maxEntries
				if (filteredList.length > settings.maxEntries) {
					filteredList = filteredList.slice(0, settings.maxEntries);
				}

				// as we want to entries in autocomplete list to be displayed in normal case
				// (and not lowercased as the entries in filteredList)
				// we have to find the correctly speed version of the word
				// so we just map each entry to its original, un-lowercased equivalent
				filteredList = filteredList.map(function (el) {
					return settings.autocompleteList[lowercase.indexOf(el)];
				});

				if (selectedEntry === null || filteredList.indexOf(selectedEntry) < 0) {
					selectedEntry = filteredList[0];
				}
				else {
				}

				entriesList = filteredList;

				// display all entries in autocompletion list
				$autocompletionList.html(filteredList.reduce(function (prev, current) {
					var selected = current === selectedEntry ? ' class="selected"' : '';
					return prev + '<li' + selected + '>' + current + '</li>';
				}, ''));

			});
		});

		// support jquery-chaining
		return this;
	};
}(jQuery));
