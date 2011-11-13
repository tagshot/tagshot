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
 * <ul id='autocompletion-list-0'>
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
	/*
	 * Helper-function to position cursor in a textbox.
	 * Works in Chrome and Firefox only.
	 */
	var setCaretPosition = function (ctrl, pos) {
		ctrl.focus();
		ctrl.setSelectionRange(pos, pos);
	};
	var getCaretPosition = function (ctrl) {
		return ctrl.selectionStart;
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
			maxEntries: 10,
			onTagAdded: function (tagText) {
				console.log('Tag "' + tagText + '" added.');
			},
			onTagRemoved: function (tagText) {
				console.log('Tag removed.');
			}
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

			// at first, build an object containing all neccessary information for the current <input>-element processed
			// this is one instance of the plugin
			var p = {
				// save reference to dom-node
				input: this,
				// jqueryify <input>-element
				$input: $(this),
				tags: [],
				removeTagOnNextBackspace: false,
				init: function () {
					// will save jqueryfied references to tag- and autocompletion-list
					this.$tagList = null;
					this.$autocompletionList = null;
					this.parent = this.$input.parent();
					// build a unique id for the current element
					this.autocompletionListId = 'autocompletion-list-' + autoCompleteListId;
					// now save some element data needed for computation
					this.selectedEntry = null;
					// save the entries currently displayed in autocompletion
					this.entriesList = []
				},
				addTag: function () {
					var that = this;
					if (this.selectedEntry === null)
						return;
					settings.onTagAdded(this.selectedEntry);
					this.$input.val('').parent().before('<li class="tag">' + this.selectedEntry + '<button>x</button></li>');
					this.$tagList.find('li button').last().click(function () {
						$(this).parent().addClass('tagautocomplete-to-be-removed');
						that.removeTag();
					});
					this.tags.push(this.selectedEntry);
					this.selectedEntry = null;
					this.entriesList = [];
					this.displayAutocompletionList();
					this.updateAutocompletionListPosition();
					this.input.focus();
				},
				removeTag: function () {
					settings.onTagRemoved();
					p.$tagList.children('.tagautocomplete-to-be-removed').remove();
					p.removeTagOnNextBackspace = false;
					p.updateAutocompletionListPosition();
					p.input.focus();
				},
				displayAutocompletionList:  function () {
					var that = this;
					// display all entries in autocompletion list
					this.$autocompletionList.html(this.entriesList.reduce(function (prev, current) {
						var selected = current === that.selectedEntry ? ' class="autocomplete-selected"' : '';
						return prev + '<li' + selected + '>' + current + '</li>';
					}, ''));
					this.$autocompletionList.children('li').click(function () {
						var $this = $(this);
						$this.removeClass('autocomplete-selected');
						that.selectedEntry = this.textContent;
						that.addTag();
					}).mouseover(function (event) {
						/* manually handle mouse-selection */
						that.$autocompletionList.children('li').removeClass('autocomplete-selected');
						that.selectedEntry = $(event.target).addClass('autocomplete-selected').text();
					});
				},
				updateAutocompletionListPosition: function() {
					this.offset = this.$input.offset();
					this.height = this.$input.outerHeight();
					this.width = this.$input.outerWidth();
					this.$autocompletionList
						.css('top', this.offset.top + this.height + 5)
						.css('left', this.offset.left)
						.css('width', this.width + 'px');
				}
			};

			p.init();

			// exit, if the current element is not a <input type="text" />
			if (p.input.tagName.toLowerCase() !== 'input' && p.$input.attr('type').toLowerCase() !== 'text') {
				console.error('Trying to use tagAutocomplete-Plugin for a non <input type="text" />-field - Fail!');
				return;
			}
			// increase id counter to create a really unique id next time, as well
			autoCompleteListId += 1;

			// create tag list, add css class from input-field and put <input>-field right into it
			p.$tagList = $('<ul><li></li><br style="clear: both;" /></ul>').addClass(settings.inputCssClass).prependTo(p.parent);
			p.$tagList.children('li').last().append(p.$input);
			// remove css class from input field and set clear style for input
			p.$input.removeClass(settings.inputCssClass).addClass('tagautocomplete-clear-textbox');

			// create autocompletion list, add css class, and prepare for positioning later
			p.$autocompletionList = $('<ul class="' + settings.autocompleteCssClass + '" id="' + p.autocompletionListId + '"></ul>').appendTo('body');
			p.updateAutocompletionListPosition();

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
			p.$input.keydown(function (event) {
				switch (event.keyCode) {
					case keyCodes.BACKSPACE:
						p.selectedEntry = null;
						if (getCaretPosition(p.input) === 0 && p.$tagList.children('li').length >= 2) {
							if (p.removeTagOnNextBackspace) {
								p.removeTag();
							}
							else {
								p.$tagList.children('li').last().prev().addClass('tagautocomplete-to-be-removed');
								p.removeTagOnNextBackspace = true;
							}
						}
						break;
					case keyCodes.ENTER:
						p.addTag();
						break;
					case keyCodes.LEFT:
						break;
					case keyCodes.DOWN:
						var index = p.entriesList.indexOf(p.selectedEntry);
						p.selectedEntry = p.entriesList[Math.min(index + 1, p.entriesList.length - 1)];
						p.$autocompletionList.children('li').removeClass('selected');
						p.displayAutocompletionList();
						event.preventDefault();
						break;
					case keyCodes.UP:
						var index = p.entriesList.indexOf(p.selectedEntry);
						p.selectedEntry = p.entriesList[Math.max(index - 1, 0)];
						p.$autocompletionList.children('li').removeClass('selected');
						p.displayAutocompletionList();
						event.preventDefault();
						break;
					default:
						p.$tagList.children('li').removeClass('tagautocomplete-to-be-removed');
						p.removeTagOnNextBackspace = false;
						break;
				}
			}).keyup(function (event) {
				    // text refers to the <input>'s text _after_ the keystroke
				var text = this.value.toLowerCase(),
				    // filteredList will hold all those entries which match the current search criteria
				    filteredList,
				    // only keep those entries which start with the search string, (escape! text before, else there will be problems with e.g searching for 'C++')
				    regex = new RegExp('^' + text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));

				// at first check, whether there is something to filter ..
				if (text.length === 0) {
					// if not, do not display autocompletion.
					$('#' + p.autocompletionListId).html('');
					p.selectedEntry = null;
					return;
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

				// save filtered list
				p.entriesList = filteredList;

				// if no entries are left, stop processing
				if (filteredList.length === 0) {
					p.selectedEntry = null;
					p.displayAutocompletionList();
					return;
				}
				// if there is no previous entry or the previous entry is not in the list anymore, use first
				if (p.selectedEntry === null || filteredList.indexOf(p.selectedEntry) < 0) {
					p.selectedEntry = filteredList[0];
				}
				p.displayAutocompletionList();
			});
		});

		// support jquery-chaining
		return this;
	};
}(jQuery));