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

	var methods = {
		init: function (options) {
			 // will hold a lowercased-version of settings.autocompleteList
			 var lowercase,
			     that = this,
			// standard settings
			    settings = {
				// list of possible autocompletions
				autocompleteList: [],
				// css class for the autocompletion list
				autocompleteCssClass: 'autocompletion-list',
				// autocomplete to be removed class
				tagRemoveClass: 'tagautocomplete-to-be-removed',
				// css class for the <input>-element,
				// will be applied to the surrounding <ul> during the plugin-process (see above for explanation)
				inputCssClass: 'textbox',
				// the maximum number of entries to be displayed while autocompletion
				maxEntries: 10,
				// auto select
				autoSelect: false,
				autocompleteListPosition: 'below',
				onTagAdded: function (tagList, newTag) {
					console.log('Tag "' + newTag + '" added.');
				},
				onTagRemoved: function (tagText) {
					console.log('Tag removed.');
				},
				onKeyEvent: function (keyCode) { },
				postProcessors: []
			};
			// merge given options into standard-settings
			$.extend(settings, options);

			/*
			 * Create a lowercased version of settings.autocompleteList,
			 * This is needed to be case-insensitive, so typing 'java'
			 * will also find 'Java'.
			 * Input:
			 * {
			 * 	'JavaScript': 100
			 * 	'Java': 20
			 * }
			 * Output:
			 * [
			 * 	['javascript', 100, 'JavaScript'],
			 * 	['java', 20, 'Java']
			 * ]
			 */
			lowercase = [];
			for (var entry in settings.autocompleteList) {
				if (!settings.autocompleteList.hasOwnProperty(entry)) continue;
				lowercase.push([entry.toLowerCase(), settings.autocompleteList[entry], entry]);
			}
			// not the best place for this, refactor
			lowercase.push(['1*', 1, '★☆☆☆☆']);
			lowercase.push(['2*', 1, '★★☆☆☆']);
			lowercase.push(['3*', 1, '★★★☆☆']);
			lowercase.push(['4*', 1, '★★★★☆']);
			lowercase.push(['5*', 1, '★★★★★']);
			lowercase.push(['=1*', 1, '=★☆☆☆☆']);
			lowercase.push(['=2*', 1, '=★★☆☆☆']);
			lowercase.push(['=3*', 1, '=★★★☆☆']);
			lowercase.push(['=4*', 1, '=★★★★☆']);
			lowercase.push(['=5*', 1, '=★★★★★']);
			this.data('tagAutocompletion-list', { list: lowercase });

			this.each(function () {
				// javascript note: this now refers to the input dom element

				// at first, build an object containing all neccessary information for the current <input>-element processed
				// this is one instance of the plugin
				var p = {
					// save reference to dom-node
					input: this,
					// jqueryify <input>-element
					$input: $(this),
					// saves all tags
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
						this.autocompletionEntriesList = []
						// if there is no autoselection, no entry can be selected (indicated by -1)
						this.minIndex = this.autoSelect === true ? 0 : -1;
					},
					correctTag: function (tag) {
						var thatCorrectTags = this,
						    correctedTag = tag;
						that.data('tagAutocompletion-list').list.forEach(function (el) {
							if (el[2] === tag) {
								correctedTag = el[0];
								return false;
							}
						});
						return correctedTag;
					},
					addTag: function () {
						var newTag = '',
						thatAddTag = this,
						tempEntry = '';
						this.updateTags();
						// if only tags are accepted and no entry is selected, abort
						if (this.selectedEntry === null && settings.autoSelect)
							return;
						// if we have no selected entry, and this is allowed, just take textbox-value
						if (this.selectedEntry === null && settings.autoSelect === false) {
							this.selectedEntry = this.$input.val();
						}
						if (this.selectedEntry === '' || this.tags.indexOf(this.selectedEntry) !== -1)
							return;
						this.selectedEntry = this.correctTag(this.selectedEntry);
						newTag = this.selectedEntry;
						this.tags.push(this.selectedEntry);
						// apply postprocessing as specified by parameters
						this.doPostProcessing(this.selectedEntry);
						this.$input.val('').parent().before('<li class="tag"><span>' + this.selectedEntry + '</span><a></a></li>');
						this.$tagList.find('li a').last().click(p.removeClickedTag);
						this.selectedEntry = null;
						this.autocompletionEntriesList = [];
						this.displayAutocompletionList();
						this.updateAutocompletionListPosition();
						this.input.focus();
						settings.onTagAdded(this.tags.slice(0), newTag);
					},
					removeTag: function () {
						var markedTag = p.$tagList.children('.' + settings.tagRemoveClass);
						var removedTagText = markedTag.text();
						markedTag.remove();
						this.updateTags();
						p.removeTagOnNextBackspace = false;
						p.updateAutocompletionListPosition();
						p.input.focus();
						settings.onTagRemoved(this.tags.slice(0), removedTagText);
					},
					removeClickedTag: function () {
						$(this).parent().addClass(settings.tagRemoveClass);
						p.removeTag();
					},
					updateTags: function () {
						var updatedTags = [],
						    thatUpdateTags = this;
						this.$tagList.find('li.tag').each(function() {
							updatedTags.push(thatUpdateTags.correctTag($(this).text()));
							$(this).children('a').unbind('click').click(p.removeClickedTag);
						});
						this.tags = updatedTags;
					},
					doPostProcessing: function (entry) {
						for (var i = 0; i < settings.postProcessors.length; i++) {
							var postprocessor = settings.postProcessors[i];
							this.selectedEntry = postprocessor(this.selectedEntry);
						}
					},
					displayAutocompletionList:  function (currentSearch) {
						var that = this;
						// display all entries in autocompletion list
						this.$autocompletionList.html(this.autocompletionEntriesList.reduce(function (prev, current) {
							var selected = current === that.selectedEntry ? ' class="autocomplete-selected"' : '';
							current = '<strong>' + current.substr(0, currentSearch.length) + '</strong>' + current.substr(currentSearch.length);
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
						if (settings.autocompleteListPosition === 'below') {
							this.$autocompletionList
								.css('top', this.offset.top + this.height + 5)
								.css('left', this.offset.left)
								.css('width', this.width + 'px');
						}
						else if (settings.autocompleteListPosition === 'above') {
							var listHeight = this.$autocompletionList.outerHeight();
							this.$autocompletionList
								.css('top', this.offset.top - listHeight - 5)
								.css('left', this.offset.left)
								.css('width', this.width + 'px');
						}
					},
					doTagMovement: function (firstOrLast, prevOrNext, modifierKeyPressed) {
						if (!modifierKeyPressed) return;
						if (!p.removeTagOnNextBackspace) {
							if (getCaretPosition(p.input) === 0 && p.$input.val().length === 0) {
								firstOrLast.addClass(settings.tagRemoveClass);
								p.removeTagOnNextBackspace = true;
							}
							return;
						}
						this.$tagList.children('.' + settings.tagRemoveClass).removeClass(settings.tagRemoveClass);
						var node = prevOrNext;
						if (node.length !== 0) {
							node.addClass(settings.tagRemoveClass);
						}
						else {
							p.removeTagOnNextBackspace = false;
						}
					}
				};

				that.data('tagAutocompletion-plugin', { plugin: p });

				p.init();

				// exit, if the current element is not a <input type="text" />
				if (p.input.tagName.toLowerCase() !== 'input' && p.$input.attr('type').toLowerCase() !== 'text') {
					console.error('Trying to use tagAutocomplete-Plugin for a non <input type="text" />-field - Fail!');
					return;
				}
				// increase id counter to create a really unique id next time, as well
				autoCompleteListId += 1;

				// create tag list, add css class from input-field and put <input>-field right into it
				p.$tagList = $('<ul><li></li><span style="clear: both;" /></ul>').addClass(settings.inputCssClass).prependTo(p.parent).click(function () {
					p.$input.focus();
				});
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
					if (settings.onKeyEvent(event) === false) {
						console.log(event);
						return false;
					}
					var text = this.value.toLowerCase();
					p.$autocompletionList.show(0);
					switch (event.keyCode) {
						case keyCodes.BACKSPACE:
							p.selectedEntry = null;
							if (getCaretPosition(p.input) === 0 && p.$tagList.children('li').length >= 2) {
								if (p.removeTagOnNextBackspace) {
									p.removeTag();
								}
								else {
									p.$tagList.children('li').last().prev().addClass(settings.tagRemoveClass);
									p.removeTagOnNextBackspace = true;
								}
							}
							break;
						case keyCodes.ENTER:
							if (p.$input.val().length !== 0) {
								p.addTag();
							}
							else {
								var tagRemove = p.$tagList.children('.' + settings.tagRemoveClass);
								if (tagRemove.length !== 0) {
									var value = tagRemove.text();
									p.removeTag();
									p.$input.val(value);
								}
							}
							break;
						case keyCodes.LEFT:
							var last = p.$tagList.children('li').last().prev();
							var prev = p.$tagList.children('.' + settings.tagRemoveClass).prev('.tag');
							p.doTagMovement(last, prev, event.shiftKey);
							break;
						case keyCodes.RIGHT:
							var first = p.$tagList.children('li').first();
							var next = p.$tagList.children('.' + settings.tagRemoveClass).next('.tag');
							p.doTagMovement(first, next, event.shiftKey);
							break;
						case keyCodes.DOWN:
							var index = p.autocompletionEntriesList.indexOf(p.selectedEntry);
							p.selectedEntry = p.autocompletionEntriesList[Math.min(index + 1, p.autocompletionEntriesList.length - 1)];
							p.$autocompletionList.children('li').removeClass('selected');
							p.displayAutocompletionList(text);
							event.preventDefault();
							break;
						case keyCodes.UP:
							var index = p.autocompletionEntriesList.indexOf(p.selectedEntry);
							p.selectedEntry = p.autocompletionEntriesList[Math.max(index - 1, p.minIndex)];
							p.$autocompletionList.children('li').removeClass('selected');
							p.displayAutocompletionList(text);
							event.preventDefault();
							break;
						default:
							p.$tagList.children('li').removeClass(settings.tagRemoveClass);
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

					var lowerCasedTags = p.tags.map(function (el) { return el.toLowerCase(); } );
					// filter list
					filteredList = $(this).data('tagAutocompletion-list').list.filter(function (el) {
						// true, when something was found (search returns index of first occurrence) and tag is not already in current tags
						return el[0].search(regex) >= 0 && lowerCasedTags.indexOf(el[0]) === -1;
					});

					// sort by priority
					filteredList = filteredList.sort(function (a, b) {
						if (a[1] === b[1]) return 0;
						else if (a[1] < b[1]) return +1;
						else return -1;
					});

					// limit to settings.maxEntries
					if (filteredList.length > settings.maxEntries) {
						filteredList = filteredList.slice(0, settings.maxEntries);
					}

					// as we want to entries in autocomplete list to be displayed in normal case
					// (and not lowercased as the entries in filteredList)
					// we have to find the correctly spelled version of the word
					// so we just map each entry to its original, un-lowercased equivalent
					filteredList = filteredList.map(function (el) {
						return el[2];
					});

					// save filtered list
					p.autocompletionEntriesList = filteredList;

					// if no entries are left, stop processing
					if (filteredList.length === 0) {
						p.selectedEntry = null;
						p.displayAutocompletionList(text);
						return;
					}
					// if there is no previous entry or the previous entry is not in the list anymore, use first
					if (p.selectedEntry === null || filteredList.indexOf(p.selectedEntry) < 0) {
						if (settings.autoSelect)
							p.selectedEntry = filteredList[0];
					}
					p.displayAutocompletionList(text);
					p.updateAutocompletionListPosition();
				}).focus(function () {
					p.$autocompletionList.show(0);
				}).blur(function () {
					window.setTimeout(function () {
						p.$autocompletionList.hide(0);
					}, 200);
				});
			});

			// support jquery-chaining
			return this;
		},
		addTag: function (newTag) {
			var lowercase = this.data('tagAutocompletion-list').list;
			var realNames = lowercase.map(function (el) { return el[2]; });
			if (realNames.indexOf(newTag) === -1) {
				lowercase.push([newTag.toLowerCase(newTag), 1, newTag]);
				this.data('tagAutcompletion', { 'list': lowercase });
			}
		},
		updateTags: function () {
			var plugin = this.data('tagAutocompletion-plugin').plugin;
			plugin.updateTags();
		}
	};


	$.fn.tagAutocomplete = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    
	};
} (jQuery));
