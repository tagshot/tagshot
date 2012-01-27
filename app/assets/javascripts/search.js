Tagshot.search = function (tagList) {
	// TODO add '+' means AND, ',' means OR,
	// consult https://student.hpi.uni-potsdam.de/redmine/projects/tagshot/wiki/JSON-API#Search-for-photos
	var searchString = tagList.join("+");

	// navigate to search and the rest will be done by the backbone fairy
	Tagshot.router.navigate('search/'+searchString, true);
}

