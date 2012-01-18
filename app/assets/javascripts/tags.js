tags = {};


/*****************************/
/* Regexes that match input */
/*****************************/

// Find stars as a search criteria
// search for number of stars greater than or equal the given digit
// matches >=3*, >3*,
// =3* and 3* which are equivalent
// <3* and <=3*
// no whitespace allowed!


tags.find = {};

tags.find.starExpression = function (text) {
// DANGER: Number of stars is a digit, not [0-5]
	return text.match(/^(<|<=|=|>|>=)?([0-9])\*$/) !== null;
};


/*****************************/
/* Regexes that replace input */
/*****************************/

tags.replace = {};

tags.replace.starExpression = function (text) {
	match = text.match(/^(<|<=|=|>|>=)?([0-9])\*$/);
	var starNumber = match[2];
	var prefix = match[1];

	switch(prefix) {
		case '<=':
			return tags.helpers.starString('≤', starNumber);
		case '=':
			return tags.helpers.starString('', starNumber);
		case undefined:
			return tags.helpers.starString('', starNumber);
		case '>=':
			return tags.helpers.starString('≥', starNumber);
		default:		// '<' and '>' are just fine
			return tags.helpers.starString(prefix, starNumber);
	}
};


/*****************************/
/* Helper Functions */
/*****************************/

tags.helpers = {};

tags.helpers.starString = function(prefix, starNumber) {
	var starString = prefix;
	for (var i = 0; i < starNumber; i++)
		starString += '★';
	for (var i = 0; i < 5 - starNumber; i++)
			starString += '☆';
	return starString;
};
