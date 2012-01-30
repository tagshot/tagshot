Tagshot.addTag = function (tagList, newTag) {
	Tagshot.localVersionDirty = true;
	Tagshot.collections.photoList.selection().forEach(function (model) {
		var tags = model.get("tags").slice(0);
		tags.push(newTag);
		// use slice(0) to get a copy of tagList
		model.set({'tags': tags.slice(0)});
	});
};
Tagshot.removeTag = function (tagList) {
	Tagshot.localVersionDirty = true;
	Tagshot.collections.photoList.selection().forEach(function (model) {
		// use slice(0) to get a copy of tagList
		model.set({'tags': tagList.slice(0)});
	});
};
