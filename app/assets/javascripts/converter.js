/* This Module transforms all searchable strings
 * It is used to make fancy unicode stars from text input in
 * the search or tags bar, transforms the tags into a query
 * and replaces the URL/Query string to fancy unicode stars back again.
 *
 * BEWARE: This module is COMPLETELY OPTIMISTIC about user input.
 * There is no error handling.
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
		/* url: stars:3
		 * textinput: <3*
		 * stars: ★★★★☆
		 */

		// BEWARE: Number of stars is a digit, not [0-5]
		var RATING_INPUT = /^(<|<=|=|>|>=)?([0-9])\*$/;
		var RATING_QUERY_TOKEN = /^stars:(<|<=|=|>|>=)?[0-9]$/
		var URL_STAR_TOKEN = /^stars:(<|<=|=|>|>=)?([0-9])$/;
		var OR_TOKEN = /^(OR|ODER|;)$/i;	// case insensitive 'or' in English, German or Prolog/Erlang
		var OR_URL_TOKEN = ','	// We separate Tag1 OR Tag2 in the URL with Tag1,Tag2
		var OR_REPLACER = 'OR';		// OR in URL gets transformed in this input string


		// The token format [OPERATOR, TAG] is stupid as hell. FIXME!

		return {

/***********************************
 * API Functions
 * *********************************/

			inputToQuery: function(textList) {
				var self = this;
				return _.map(textList, function(token) {
					if (self.isORtoken(token)) {
						return ',';
					}
					if (self.isRatingInput(token)) {
						return self.buildStarQueryToken(token);
					}
					return token;
				}).join('+').replace(/\+,\+/, ',')		// AND is default for search, if OR occured, fix URL from 'a+,+b' to 'a,b'
			},

			queryToInput: function(url) {
				// This unicodifies a url
				var self = this;
				var inp = _.map(self.findTokensInURL(url), function(t) {
					return self.inputToStars(self.stripStarPrefix(t))
				});
				return inp;
			},

			inputToStars: function (text) {
				var match = text.match(RATING_INPUT);
				if (match === null) {
					return text;
				}
				var starNumber = match[2];
				var prefix = match[1];
				var starString = Tagshot.converter.buildStarString(Tagshot.converter.prefixToUnicode(prefix), starNumber);
				return starString;	// return of function invocations and this.buildStarString() does not work, WTFJS!
			},

/***********************************
 * Internal Functions
 * *********************************/


			findTokensInURL: function(url) {
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
			},


/*****************************/
/* Helper Functions */
/*****************************/

			isORtoken: function(token) {
				return OR_TOKEN.test(token);
			},

			isRatingInput: function (token) {
				return RATING_INPUT.test(token);
			},

			isRatingQuery: function(token) {
				return RATING_QUERY_TOKEN.test(token);
			},

			buildStarQueryToken: function(token) {
				// remove trailing '*'
				return 'stars:' + token.slice(0, -1)
			},
			
			stripStarPrefix: function(token) {
				// simply strips 'stars:' prefix from search url
				var match = token.match(URL_STAR_TOKEN);
				if (match === null) {
						return token // it is no star token like stars:<3
				}
				var starToken = match[0];
				return starToken.substr(6)+'*'; // 'stars:'.length === 6
			},

			convertOR: function(token) {
				if (token === OR_URL_TOKEN) {
					return OR_REPLACER;
				}
				return token;
			},

			prefixToUnicode: function(prefix) {
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
			},

			buildStarString: function(prefix, starNumber) {
				var starString = prefix;
				for (var i = 0; i < starNumber; i++)
					starString += '★';
				for (var i = 0; i < 5 - starNumber; i++)
						starString += '☆';
				return starString;
			}
		};
}());
