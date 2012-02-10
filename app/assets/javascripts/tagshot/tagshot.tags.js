/*
 * Adding and removing tags from the current selection
 * ================================================================================
 * This module offers to methods to add or rather remove tags on the current
 * selection.
 * Adding and removing is append only: When more than one photo is selected
 *   the tag is added to all of them without deleting the existing ones.
 * It marks the local version to be dirty, so we know at the next server save
 * request.
 *
 * Note on the use of slice(0):
 *   We need this throughout the whole module, to get a one level deep copy of the array.
 *   Else, we have a reference to the same object and we have nasty side-effects, when
 *   changing that array again later.
 */
Tagshot.addTag = function (tagList, newTag) {
	Tagshot.localVersionDirty = true;
	Tagshot.collections.photoList.selection().forEach(function (model) {
		var tags = model.get("tags").slice(0);
		tags.push(newTag);
		Tagshot.ui.selectors.searchBox.tagAutocomplete('addTag', newTag);
		Tagshot.ui.selectors.tagBox.tagAutocomplete('addTag', newTag);
		// Use slice(0) to get a copy of tagList. Else we will have nasty side-effects.
		model.set({'tags': tags.slice(0)});
	});
};
Tagshot.removeTag = function (tagList, removedTag) {
	Tagshot.localVersionDirty = true;
	Tagshot.collections.photoList.selection().forEach(function (model) {
		var tags = model.get("tags").slice(0);
		var index = tags.indexOf(removedTag);
		tags.splice(index, 1);
		// Use slice(0) to get a copy of tagList. Else we will have nasty side-effects.
		model.set({'tags': tags });
	});
};
