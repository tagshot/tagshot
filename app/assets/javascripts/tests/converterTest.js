$(document).ready(function() {

	module("Module Converter.js");

	var converter = Tagshot.converter;

/*************************************
 * Tests for unicodification of stars
 *************************************/

	module("Converter.js:: Input->Unicode");

	test("prefixToUnicode unicodifies >= and <=, removes = and the rest falls through", function() {
		equals(converter.test.prefixToUnicode('<='), '≤');
		equals(converter.test.prefixToUnicode('>='), '≥');
		equals(converter.test.prefixToUnicode('='), '');
		equals(converter.test.prefixToUnicode(''), '');
		equals(converter.test.prefixToUnicode(' '), ' ');
	});


	test("buildStarString builds maximum 5 white stars", function() {
		var min = converter.test.buildStarString('', 5);
		var max = converter.test.buildStarString('', 0);
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
		ok(converter.test.isORtoken('OR'));
		ok(converter.test.isORtoken('Or'));
		ok(converter.test.isORtoken('or'));
		ok(converter.test.isORtoken('Oder'));
		ok(converter.test.isORtoken('oDEr'));
		ok(converter.test.isORtoken(';'));
		equals(converter.test.isORtoken(','), false);
	});


/*************************************
 * Tests for URL->Input
*************************************/

	module("Converter.js:: URL->Input");

	test("findTokensInURL splits 'a,b,stars:<3,d+f'' into ['a','OR','b','OR','stars:<3','OR','d','f']", function() {
		var actual = converter.test.findTokensInURL('a,b,stars:<3,d+f');
		var expected = ['a','OR','b','OR','stars:<3','OR','d','f'];
		console.log(actual);
		ok(expected.equals(actual));
	});

	test("isRatingQuery recognizes 'stars:<3' but not 'star:foo'", function() {
		equals(converter.test.isRatingQuery('stars:<3'), true);
		equals(converter.test.isRatingQuery('stars:foo'), false);
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

	test("querytoInput builds ['a', 'b', 'OR', 'c', 'OR', 'd'] from 'a,b+c+d'", function() {
		var actual = converter.queryToInput('a,b+c+d');
		console.log('Query->Input: T2 ', actual); 
		ok(['a','OR','b','c','d'].equals(actual));
	});

	test("queryToInput removes source:3 at the end of an url", function() {
		var actual = converter.queryToInput('a,b+c+source:3');
		ok(['a','OR','b','c'].equals(actual));
	});

	test("queryToInput removes source:id at the beginning of an url", function() {
		var actual = converter.queryToInput('source:1');
		var expected = [];
		ok(expected.equals(actual));
	});

	test("queryToSources returns all id as an array", function() {
		var actual1 = converter.queryToSources("a+b,c+source:3");
		var actual2 = converter.queryToSources("a+b,c+source:3|52");
		var actual3 = converter.queryToSources("a+b,c+source:3|52|7");
		ok([3].equals(actual1));
		ok([3, 52].equals(actual2));
		ok([3, 52, 7].equals(actual3));

	});

	test("queryToSources returns an empty array if no source was specified in url", function() {
		var expected = [];
		var actual = 'a,b+c';
		ok(expected.equals(converter.queryToSources(actual)));
	
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


/*************************************
 * Tests for query strip
*************************************/

	module("Converter.js:: strip");

	test("Strip source from 'hpi+source:2|23|4'", function() {
		equals(converter.stripSources('hpi+source:2|23|4'), 'hpi');
	});

    test("Strip source from 'hpi+source:2'", function() {
		equals(converter.stripSources('hpi+source:2'), 'hpi');
	});

    test("Strip source from 'source:2'", function() {
		equals(converter.stripSources('source:2'), '');
	});

    test("Strip source from 'hpi+hasso+stars:3+source:2|3'", function() {
		equals(converter.stripSources('hpi+hasso+stars:3+source:2|3'), 'hpi+hasso+stars:3');
	});



});
