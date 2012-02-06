$(document).ready(function() {

	module("Module Converter.js");

	var converter = Tagshot.converter;

/*************************************
 * Tests for unicodification of stars
 *************************************/

	module("Converter.js:: Input->Unicode");

	test("prefixToUnicode unicodifies >= and <=, removes = and the rest falls through", function() {
		equals(converter.prefixToUnicode('<='), '≤');
		equals(converter.prefixToUnicode('>='), '≥');
		equals(converter.prefixToUnicode('='), '');
		equals(converter.prefixToUnicode(''), '');
		equals(converter.prefixToUnicode(' '), ' ');
	});


	test("buildStarString builds maximum 5 white stars", function() {
		var min = converter.buildStarString('', 5);
		var max = converter.buildStarString('', 0);
		equal(max, '☆☆☆☆☆', '5 white stars');
		equal(min, '★★★★★', 'No white but 5 black stars');
	});

	test("inputToStars builds up to 9 stars", function() {
		var longStarString = converter.inputToStars('9*');
		equals(longStarString.length, 9, 'There are 9 black stars');
	});

	test("inputToStars parses <3*", function() {
		equals(converter.inputToStars('<3*'), '<★★★☆☆');
	});

	test("inputToStars parses <=3*", function() {
		equals(converter.inputToStars('<=3*'), '≤★★★☆☆');
	});

	test("inputToStars parses >=3*", function() {
		equals(converter.inputToStars('>=3*'), '≥★★★☆☆');
	});

	test("inputToStars parses >3*", function() {
		equals(converter.inputToStars('>3*'), '>★★★☆☆');
	});

	test("=3* and 3* are equal", function() {
		equals(converter.inputToStars('=3*'), converter.inputToStars('3*'))
	});

		test("The whitespace in '< 3*' prevents recognition", function() {
		equals('< 3*', converter.inputToStars('< 3*'));
	});


/*************************************
 * Tests for Input->URL and URL->Input
 *************************************/


	module("Converter.js:: Input->Tokens");

	test("Logical OR can be English or German or Prolog style ';'", function() {
		ok(converter.isORtoken('OR'));
		ok(converter.isORtoken('Or'));
		ok(converter.isORtoken('or'));
		ok(converter.isORtoken('Oder'));
		ok(converter.isORtoken('oDEr'));
		ok(converter.isORtoken(';'));
		equals(converter.isORtoken(','), false);
	});

	test("parseOR parses 'a,b+c' to [['', 'a'], [',', 'b+c']]", function() {
		var actual = converter.parseOR('a,b+c');
		var expected = [['', 'a'], [',', 'b+c']];
		ok(Tagshot.helpers.equalArrays(actual, expected));
	});

	test("parseAND parses [['', 'a'], [',', 'b+c']] to [['', 'a'], [',', 'b'], ['+', 'c']]", function() {
		var actual = converter.parseAND([['', 'a'], [',', 'b+c']] );
		var expected =  [['', 'a'], [',', 'b'], ['+', 'c']];
		ok(Tagshot.helpers.equalArrays(actual, expected));
	});


	module("Converter.js:: URL->Input");

	test("URLtoInput strips 'stars:' prefix and adds '*', other strings fall through", function() {
		equals(converter.URLtoInput('stars:<=3'), '<=3*');
		equals(converter.URLtoInput('Tag1'), 'Tag1');
	});

	test("findTokensInURL splits 'tag1+stars:<3+tag2' into ['','tag1'], ['+', 'stars:<3'], ['+', 'tag2']", function() {
		// in JS ['a', 'b'] !== ['a', 'b']
		var tokens = converter.findTokensInURL('tag1+stars:<3+tag2');
		var expected = [['','tag1'], ['+', 'stars:<3'], ['+', 'tag2']];
		console.log("Expected ", expected, 'Got1', tokens);
		ok(Tagshot.helpers.equalArrays(tokens, expected));
	});

		test("findTokensInURL splits 'tag1,tag2' into [['','tag1'], [',', 'tag2']]", function() {
		// in JS ['a', 'b'] !== ['a', 'b']
		var tokens = converter.findTokensInURL('tag1,tag2');
		var expected = [['','tag1'], [',', 'tag2']];
		console.log("Expected ", expected, 'Got2 ', tokens);
		ok(Tagshot.helpers.equalArrays(tokens, expected));
	});

		test("findTokensInURL splits 'a,b+c,d' into [['','a'], [',', 'b'], ['+', 'c'], [',', 'd']]", function() {
		// in JS ['a', 'b'] !== ['a', 'b']
		var actual = converter.findTokensInURL('a,b+c,d');
		var expected = [['','a'], [',', 'b'], ['+', 'c'], [',', 'd']];
		console.log("Expected ", expected, 'Got3 ', actual);
		ok(Tagshot.helpers.equalArrays(actual, expected));
	});


	test("isRatingQuery recognizes 'stars:<3' but not 'star:foo'", function() {
		equals(converter.isRatingQuery('stars:<3'), true);
		equals(converter.isRatingQuery('stars:foo'), false);
	});

	test("queryToInput builds from URL 'stars:<3+Tag1+Tag2' a unicodified tag list ['<★★★☆☆', 'foo', 'bar']", function() {
			equals(Tagshot.helpers.equalArrays(converter.queryToInput('stars:<3+Tag1+Tag2'), ['<★★★☆☆', 'Tag1', 'Tag2']), true);
	});


	module("Converter.js:: Input->Query");

	test("Search input ['<3*', 'Tag1'] builds a search query 'stars:<3+Tag1'", function() {
		equals(converter.inputToQuery(['<3*', 'Tag1']), 'stars:<3+Tag1');
	});

	test("inputToQuery builds a+b,a+c from ['a', 'b', 'OR', 'a', 'c']", function() {
		equals(converter.inputToQuery(['a', 'b', 'OR', 'a', 'c']), 'a+b,a+c');
	});

	test("inputToQuery does not balance OR queries, it builds the query 'a+,' from ['a', 'OR']", function() {
		equals(converter.inputToQuery(['a', 'OR']), 'a+,');
	});
});
