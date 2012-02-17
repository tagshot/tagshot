/*
 * Receives search requests from the frontend and proceeds them to the backend.
 * ================================================================================
 * This module implements the high level search functionality.
 * It glues together the converter module, to be found in converter.js, and the
 * routing logic.
 *
 * The search API is documented in: wiki/JSON-API#Search-for-photos
 */
Tagshot.search = function (tagList) {
	var searchString = Tagshot.converter.inputToQuery(tagList);
	if (searchString === "" && Tagshot.collections.photoList.currentSources.length === 0)
		Tagshot.router.navigate('reset', {trigger: true});
	else {
		// build query with sources but do not save it because 
		// then we cannot detect changes
		var temp = Tagshot.collections.photoList.currentSearchQuery;
		Tagshot.collections.photoList.currentSearchQuery = searchString;
		var query = Tagshot.collections.photoList.buildQueryWithSources();
		Tagshot.collections.photoList.currentSearchQuery = temp;

		Tagshot.router.navigate('search/' + query, {trigger: true});
	}
}
