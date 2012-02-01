Tagshot.addTag = function (tagList, newTag) {
	Tagshot.localVersionDirty = true;
	Tagshot.collections.photoList.selection().forEach(function (model) {
		var tags = model.get("tags").slice(0);
		tags.push(newTag);
		Tagshot.searchBox.tagAutocomplete('addTag', newTag);
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
