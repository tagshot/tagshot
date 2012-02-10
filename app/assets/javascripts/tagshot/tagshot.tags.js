/*
 * Adding and removing tags from the current 
 * ================================================================================
 * This module offers methods to select the next, previous, above or below
 * image based on the current selection.
 * Moreover, if passed an Event it automatically selects the appropriate
 * operation to perform.
 *
 * Dependencies:
 *   It needs an Tagshot.Collections.PhotoList to get the current selection and
 *   select elements. This must be passed in via the init method.
 */

Tagshot.addTag = function (tagList, newTag) {
	Tagshot.localVersionDirty = true;
	Tagshot.collections.photoList.selection().forEach(function (model) {
		var tags = model.get("tags").slice(0);
		tags.push(newTag);
		Tagshot.ui.selectors.searchBox.tagAutocomplete('addTag', newTag);
		Tagshot.ui.selectors.tagBox.tagAutocomplete('addTag', newTag);
		// use slice(0) to get a copy of tagList
		model.set({'tags': tags.slice(0)});
	});
};
Tagshot.removeTag = function (tagList, removedTag) {
	Tagshot.localVersionDirty = true;
	Tagshot.collections.photoList.selection().forEach(function (model) {
		var tags = model.get("tags").slice(0);
		var index = tags.indexOf(removedTag);
		tags.splice(index, 1);
		// use slice(0) to get a copy of tagList
		model.set({'tags': tags });
	});
};
