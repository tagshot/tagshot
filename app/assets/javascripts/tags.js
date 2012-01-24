Tagshot.updateTags = function (tagList) {
	console.log("Update tags and send it to backend");
	Tagshot.collections.photoList.selection().forEach(function (model) {
		// use slice(0) to get a copy of tagList
		model.set({'tags': tagList.slice(0)});
	});
	/*
	Tagshot.views.forEach(function (view) {
		view.render();
	})*/
}
