//
// For Willi: Former tags.js is now tagsAutocompletion.js
//



Tagshot.updateTags = function (tagList) {
	console.log("Update tags and send it to backend");
	Tagshot.collections.photoList.selection().forEach(function (model) {
		model.save({'tags': tagList.slice(0)});
	});
	/*
	Tagshot.views.forEach(function (view) {
		view.render();
	})*/
}
