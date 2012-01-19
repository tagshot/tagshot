//
// For Willi: Former tags.js is now tagsAutocompletion.js
//



Tagshot.updateTags = function (tagList) {
	console.log("Update tags and send it to backend");
	Tagshot.collections.photoList.selection().forEach(function (model) {
		model.save({'tags': tagList});
		model.change();
	});
	/*
	Tagshot.views.forEach(function (view) {
		view.render();
	})*/
}
