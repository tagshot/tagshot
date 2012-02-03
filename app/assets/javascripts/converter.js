/* This Module transforms all searchable strings
 * It is used to make fancy unicode stars from text input in
 * the search or tags bar, transforms the tags into a query
 * and replaces the URL/Query string to fancy unicode stars back again.
 */

/***********************************************************
/* Regexes that match textinput and replaces them to stars */
/***********************************************************
 * >=3*, >3*,
 * =3* and 3* which are equivalent
 * <3* and <=3*
 * no whitespace allowed!
 */ 

/**************************************/
/* Regexes that match querystring/URL */
/*************************************
 * foo+bar to ['foo', 'bar']
 * stars:3 to ['★★★☆☆']
 * foo,bar+stars:<=3 to ['foo', 'bar', '≤★★★☆☆']
 */


Tagshot.converter = (function () {
		/* url: stars:3
		 * textinput: <3*
		 * stars: ★★★★☆
		 */

		// BEWARE: Number of stars is a digit, not [0-5]
		var TEXTINPUT = /^(<|<=|=|>|>=)?([0-9])\*$/;
		var RATING_QUERY_TOKEN = /^stars:(<|<=|=|>|>=)?[0-9]$/
		var URL_STAR_TOKEN = /^stars:(<|<=|=|>|>=)?([0-9])$/;

		return {

			inputToQuery: function(textList) {
				var self = this;
				var input = _.map(this.textList, function(token) {
					if (self.isRatingQuery(token)) {
						return self.buildStarQueryToken(token);
					}
					return token;
				}).toString();
				return input;
			},

			queryToInput: function(url) {
				var self = this;
				var input = _.map(this.findTokensInURL(url), function(token) {
					return self.inputToStars(self.URLstarsToInput(token));
				});
				return input;
			},

			inputToStars: function (text) {
				var match = text.match(TEXTINPUT);
				if (match === null) {
					return text;
				}
				var starNumber = match[2];
				var prefix = match[1];
				return this.buildStarString(this.prefixToUnicode(prefix), starNumber);
			},

			findTokensInURL: function(url) {
				// returns ['stars:<3', 'Tag1']
				var dings =  _.flatten(_.map(url.split(','), function(token) {
					return token.split('+');
				}));
				return dings;
			},

			URLstarsToInput: function(text) {
				// simply strips 'stars:' prefix from search url
				var match = text.match(URL_STAR_TOKEN);
				if (match === null) {
					return text // it is no star token like stars:<3
				}
				var starToken = match[0];
				return starToken.substr(6); // 'stars:'.length === 6
			},


/*****************************/
/* Helper Functions */
/*****************************/

			isRatingInput: function (token) {
				return token.match(TEXTINPUT) !== null;
			},

			isRatingQuery: function(token) {
				return token.match(RATING_QUERY_TOKEN);
			},

			buildStarQueryToken: function(token) {
				// remove trailing '*'
				return 'stars:' + token.slice(0, -1)
			},

			prefixToUnicode: function(prefix) {
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

