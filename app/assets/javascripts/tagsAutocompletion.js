/*****************************/
/* Regexes that match input */
/*****************************/

// Find stars as a search criteria
// search for number of stars greater than or equal the given digit
// matches >=3*, >3*,
// =3* and 3* which are equivalent
// <3* and <=3*
// no whitespace allowed!



Tagshot.converter = (function () {
		/*
		 * url: stars:3
		 * display: ★★★★★
		 * textinput: 3*
		 */
		var regexTextInputToDisplay = /^(<|<=|=|>|>=)?([0-9])\*$/;
		var urlToTextInput = /^$/;
		return {
			searchBoxToDisplay: function (text) {
				return text.match(regexSearchToDisplay) !== null;
			},
		};
}());

tagFind = {};

tagFind.starExpression = function (text) {
	// DANGER: Number of stars is a digit, not [0-5]
	return text.match(/^(<|<=|=|>|>=)?([0-9])\*$/) !== null;
};


/*****************************/
/* Regexes that replace input */
/*****************************/

tagReplace = {};

tagReplace.starExpression = function (text) {
	var match = text.match(/^(<|<=|=|>|>=)?([0-9])\*$/);
	var starNumber = match[2];
	var prefix = match[1];

	switch(prefix) {
		case '<=':
			return tagHelpers.starString('≤', starNumber);
		case '=':
			return tagHelpers.starString('', starNumber);
		case undefined:
			return tagHelpers.starString('', starNumber);
		case '>=':
			return tagHelpers.starString('≥', starNumber);
		default:		// '<' and '>' are just fine
			return tagHelpers.starString(prefix, starNumber);
	}
};


/*****************************/
/* Helper Functions */
/*****************************/

tagHelpers = {};

tagHelpers.starString = function(prefix, starNumber) {
	var starString = prefix;
	for (var i = 0; i < starNumber; i++)
		starString += '★';
	for (var i = 0; i < 5 - starNumber; i++)
			starString += '☆';
	return starString;
};
