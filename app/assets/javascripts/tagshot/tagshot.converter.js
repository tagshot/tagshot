/*
 * Convert between User-Input <-> Display <-> URL-parameters
 * ================================================================================
 * This Module transforms all searchable strings.
 * It is used to make fancy unicode stars from text input in
 * the search or tags bar, transforms the tags into a query
 * and replaces the URL/query string to fancy unicode stars back again.
 *
 * BEWARE: This module is COMPLETELY OPTIMISTIC about user input.
 * There is no error handling. Every input just falls through
 * in a pipes and filters fashion.
 */

/***********************************************************
/* Regexes that match textinput and replaces them to stars */
/***********************************************************
 * >=3*, >3*,
 * =3* and 3* which are equivalent
 * <3* and <=3*
 * no whitespace allowed!
 */ 

Tagshot.converter = (function () {
	/* 
	 * url: stars:3
	 * textinput: <3*
	 * display: ★★★☆☆
	 */

	// BEWARE: Number of stars is a digit, not [0-5]
	var RATING_INPUT       = /^(<|<=|=|>|>=)?([0-9])\*$/;
	var URL_RATING_TOKEN     = /^stars:(<|<=|=|>|>=)?([0-9])$/;

	// case insensitive 'or' in English, German or Prolog/Erlang
	var OR_TOKEN           = /^(OR|ODER|;)$/i;

	// data sources start with source: folled by numeric id, separated by pipes
	var SOURCE_TOKEN       = /^source:(\d\|)*(\d)$/i;

	// We separate Tag1 OR Tag2 in the URL with Tag1,Tag2
	var OR_URL_TOKEN       = ',';

// OR in URL gets transformed in this input string
	var OR_REPLACER        = 'OR';


/***********************************
 * API Functions
 * *********************************/

	function inputToQuery(textList) {
		return _.map(textList, function(token) {
			if (isORtoken(token)) {
				return ',';
			}
			if (isRatingInput(token)) {
				return buildStarQueryToken(token);
			}
			return token;
		}).join('+').replace(/\+,\+/, ',');
		// AND is default for search, if OR occured, fix URL from 'a+,+b' to 'a,b')
	};

	function queryToInput(url) {
		// This unicodifies a url
		var tokens = _.map(findTokensInURL(url), function(t) {
			return inputToStars(stripStarPrefix(t));

		});
		return _.reject(tokens, function(t) {
			return isSourceToken(t);
		});
	};

	function queryToSources(url) {
		return url
	};

	function inputToStars(text) {
		var match = text.match(RATING_INPUT);
		if (match === null) {
			return text;
		}
		var starNumber = match[2];
		var prefix = match[1];
		var starString = buildStarString(prefixToUnicode(prefix), starNumber);
		return starString;	// return of function invocations and this.buildStarString() does not work, WTFJS!
	};


/***********************************
* Internal Functions
* *********************************/

	function findTokensInURL(url) {
		// 'a,b+c+d,f' -> ['a', 'b', 'OR', 'c', 'OR', 'd', 'f']
		var andTokens = url.split('+');
		var tokens = _.flatten(_.map(andTokens, function(t){
				var orTokens = t.split(OR_URL_TOKEN);
				return _.zip(orTokens, _.map(_.range(orTokens.length-1), function(s) {
					return OR_REPLACER; // -> [a, OR, b, undefined]
				}));
		}));
		return _.reject(tokens, function(t) {
			return t === undefined;
		});
	};


/*****************************/
/* Helper Functions */
/*****************************/

	function isSourceToken(token) {
		return SOURCE_TOKEN.test(token);
	};

	function isORtoken(token) {
		return OR_TOKEN.test(token);
	};

	function isRatingInput(token) {
		return RATING_INPUT.test(token);
	};

	function isRatingQuery(token) {
		return URL_RATING_TOKEN.test(token);
	};

	function buildStarQueryToken(token) {
		// remove trailing '*'
		return 'stars:' + token.slice(0, -1)
	};
	
	function stripStarPrefix(token) {
		// simply strips 'stars:' prefix from search url
		var match = token.match(URL_RATING_TOKEN);
		if (match === null) {
			return token // it is no star token like stars:<3
		}
		var starToken = match[0];
		return starToken.substr(6)+'*'; // 'stars:'.length === 6
	};

	function convertOR(token) {
		if (token === OR_URL_TOKEN) {
			return OR_REPLACER;
		}
		return token;
	};

	function prefixToUnicode(prefix) {
		// unicodifies '<=' and '>=' and trims '='
		switch(prefix) {
			case '<=':
				return '≤';
			case '>=':
				return '≥';
			case '=':
				return '';
			case undefined:
				return '';
			default:		// '<', '=', '>' and empty prefix are just fine
				return prefix;
		}
	};

	function buildStarString(prefix, starNumber) {
			var starString = prefix;
			for (var i = 0; i < starNumber; i++)
				starString += '★';
			for (var i = 0; i < 5 - starNumber; i++)
				starString += '☆';
			return starString;
	};

	return {
	// Make API functions accessible
		inputToQuery:    inputToQuery,
		queryToInput:    queryToInput,
		inputToStars:    inputToStars,
		queryToSources:  queryToSources,

	// Return private methods to test them
		test: {
			prefixToUnicode:  prefixToUnicode,
			buildStarString:  buildStarString,
			inputToStars:     inputToStars,
			findTokensInURL:  findTokensInURL,
			isORtoken:        isORtoken,
			isRatingQuery:    isRatingQuery
		}
	};

}());
