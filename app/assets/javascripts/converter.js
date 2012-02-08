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
		var RATINGINPUT = /^(<|<=|=|>|>=)?([0-9])\*$/;
		var RATING_QUERY_TOKEN = /^stars:(<|<=|=|>|>=)?[0-9]$/
		var URL_STAR_TOKEN = /^stars:(<|<=|=|>|>=)?([0-9])$/;
		var OR_TOKEN = /^(OR|ODER|;)$/i;	// case insensitive 'or' in English, German or Prolog/Erlang

		return {

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
				return _.map(self.findTokensInURL(url), function(token) {
					return self.inputToStars(self.URLtoInput(token));
				});
			},

			inputToStars: function (text) {
				var match = text.match(RATINGINPUT);
				if (match === null) {
					return text;
				}
				var starNumber = match[2];
				var prefix = match[1];
				var starString = Tagshot.converter.buildStarString(Tagshot.converter.prefixToUnicode(prefix), starNumber);
				return starString;	// return of function invocations and this.buildStarString() does not work, WTFJS!
			},

			findTokensInURL: function(url) {
				// returns ['', 'stars:<3', ['+', 'Tag1'], [',', 'Tag2']]
				return this.parseAND(this.parseOR(url));
			},

			URLtoInput: function(text) {
				// simply strips 'stars:' prefix from search url
				var token = text; 
				if ($.isArray(text)) {
					token = text[1];
				}
				var match = token.match(URL_STAR_TOKEN);
				if (match === null) {
					return token // it is no star token like stars:<3
				}
				var starToken = match[0];
				return starToken.substr(6)+'*'; // 'stars:'.length === 6
			},


/*****************************/
/* Helper Functions */
/*****************************/

			parseOR: function(string) {
				return _.map(string.split(','), function(t) {
					return _.map(t.split('+'), function(andToken, i) {
						if (i == 0) {
							return ['', andToken]
						}
						return ['+', andToken]
					});
				})
			},

			parseAND: function(ORtokens) {
				var flattened = _.flatten(ORtokens, true); // only single level
				return _.map(flattened, function(t, i) {
					if (i === 0 || t[0] !== '') {
						return t
					}
					return [',', t[1]];
				})
			},

			isORtoken: function(token) {
				return token.match(OR_TOKEN) !== null;
			},

			isRatingInput: function (token) {
				return token.match(RATINGINPUT) !== null;
			},

			isRatingQuery: function(token) {
				return token.match(RATING_QUERY_TOKEN) !== null;
			},

			buildStarQueryToken: function(token) {
				// remove trailing '*'
				return 'stars:' + token.slice(0, -1)
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
