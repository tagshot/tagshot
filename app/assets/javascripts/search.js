Tagshot.search = function (tagList) {
	// TODO add '+' means AND, ',' means OR,
	// consult https://student.hpi.uni-potsdam.de/redmine/projects/tagshot/wiki/JSON-API#Search-for-photos
	var searchString,
	    match;
       

	for (var i = 0, l = tagList.length; i < l; i++) {
		match = tagList[i].match(/^(<|<=|=|>|>=)?([0-9])\*$/);
		if (match !== null) {
			console.log(match);
			var sign = match[1] === undefined ? "" : match[1];
			tagList[i] = "stars:" + sign + match[2];
		}
	}


	searchString = tagList.join("+");

	// navigate to search and the rest will be done by the backbone fairy
	Tagshot.router.navigate('search/'+searchString, true);
}
