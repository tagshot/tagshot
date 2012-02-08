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


/**********************************
 * Tests for Tokenization from URL
***********************************/


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


/*************************************
 * Tests for URL->Input
*************************************/

	module("Converter.js:: URL->Input");

	test("findTokensInURL splits 'tag1+stars:<3+tag2' into ['','tag1'], ['+', 'stars:<3'], ['+', 'tag2']", function() {
		// in JS ['a', 'b'] !== ['a', 'b']
		var tokens = converter.findTokensInURL('tag1+stars:<3+tag2');
		var expected = [['','tag1'], ['+', 'stars:<3'], ['+', 'tag2']];
		ok(tokens.equals(expected));
	});

		test("findTokensInURL splits 'tag1,tag2' into [['','tag1'], [',', 'tag2']]", function() {
		// in JS ['a', 'b'] !== ['a', 'b']
		var tokens = converter.findTokensInURL('tag1,tag2');
		var expected = [['','tag1'], [',', 'tag2']];
		ok(tokens.equals(expected));
	});

		test("findTokensInURL splits 'a,b+c,d' into [['','a'], [',', 'b'], ['+', 'c'], [',', 'd']]", function() {
		// in JS ['a', 'b'] !== ['a', 'b']
		var actual = converter.findTokensInURL('a,b+c,d');
		var expected = [['','a'], [',', 'b'], ['+', 'c'], [',', 'd']];
		ok(actual.equals(expected));
	});

	test("isRatingQuery recognizes 'stars:<3' but not 'star:foo'", function() {
		equals(converter.isRatingQuery('stars:<3'), true);
		equals(converter.isRatingQuery('stars:foo'), false);
	});

	test("queryToInput builds from URL 'stars:<3+Tag1+Tag2' a unicodified tag list ['<★★★☆☆', 'foo', 'bar']", function() {
		var actual = converter.queryToInput('stars:<3+Tag1+Tag2');
		console.log('Query->Input: T1 ', actual);
			ok(actual.equals(['<★★★☆☆', 'Tag1', 'Tag2']));
	});

	test("querytoInput builds ['a', 'b', 'OR', 'c'] from 'a,b+c'", function() {
		var actual = converter.queryToInput('a+b,c');
		console.log('Query->Input: T2 ', actual); 
		ok(['a','b','OR','c'].equals(actual));
	});

	test("querytoInput builds ['a', 'OR', 'b', 'c'] from 'a,b+c'", function() {
		var actual = converter.queryToInput('a,b+c');
		console.log('Query->Input: T2 ', actual); 
		ok(['a','OR','b', 'c'].equals(actual));
	});

	test("querytoInput builds ['a', 'OR', 'b', 'OR', 'c', 'd'] from 'a,b,c+d'", function() {
		var actual = converter.queryToInput('a,b,c+d');
		console.log('Query->Input: T2 ', actual); 
		ok(['a', 'OR', 'b', 'OR', 'c', 'd'].equals(actual));
	});

	test("querytoInput builds ['a', 'b', 'OR', 'c', 'OR', 'd', 'f'] from 'a,b+c+d,f'", function() {
		var actual = converter.queryToInput('a,b+c+d,f');
		console.log('Query->Input: T2 ', actual); 
		ok(['a', 'b', 'OR', 'c', 'OR', 'd', 'f'].equals(actual));
	});



/*************************************
 * Tests for Input->URL
*************************************/

	module("Converter.js:: Input->Query");

	test("Search input ['<3*', 'Tag1'] builds a search query 'stars:<3+Tag1'", function() {
		equals(converter.inputToQuery(['<3*', 'Tag1']), 'stars:<3+Tag1');
	});

	test("Search input ['Tag1', 'OR', 'Tag2'] builds a search query 'Tag1,Tag2'", function() {
		equals(converter.inputToQuery(['Tag1', 'OR', 'Tag2']), 'Tag1,Tag2');
	});

	test("inputToQuery builds a+b,a+c from ['a', 'b', 'OR', 'a', 'c']", function() {
		equals(converter.inputToQuery(['a', 'b', 'OR', 'a', 'c']), 'a+b,a+c');
	});

	test("Currently: inputToQuery does not balance OR queries, it builds the query 'a+,' from ['a', 'OR']", function() {
		equals(converter.inputToQuery(['a', 'OR']), 'a+,');
	});

		test("Desired: Search input ['Tag1', OR] builds a search query 'Tag1'", function() {
		equals(converter.inputToQuery(['Tag1']), 'Tag1');
		// requires intelligence in tagAutocomplete
	});
});
