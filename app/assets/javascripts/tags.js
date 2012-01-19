//
// For Willi: Former tags.js is now tagsAutocompletion.js
//



Tagshot.updateTags = function (tagList) {
	console.log("Update tags and send it to backend");
	Tagshot.collections.photoList.selection().forEach(function (model) {
		alert("neu: " + tagList);
		alert("alt: " + model.get('tags'));
		model.save({'tags': tagList});
	});
	/*
	Tagshot.views.forEach(function (view) {
		view.render();
	})*/
}
