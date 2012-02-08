/* This module implements the high level search functionality.
 * It glues together the coverter module, to be found in converter.js,
 * and the routing logic
 *
 * The search API is documented in: wiki/JSON-API#Search-for-photos
 */


Tagshot.search = function (tagList) {

	var searchString = Tagshot.converter.inputToQuery(tagList);

	// navigate to search and the rest will be done by backbone
	if (searchString === "") {
		Tagshot.router.navigate('reset', true);	// empty search is empty
	}
	else {
		Tagshot.router.navigate('search/' + searchString, true);
	}
}
