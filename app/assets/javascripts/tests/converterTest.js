$(document).ready(function() {

	module("Module Converter.js");

	var converter = Tagshot.converter;

/*************************************
 * Tests for unicodification of stars
 *************************************/

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


/**********************************************
 * Tests for user's text input and search/URL
 **********************************************/
	test("findTokensInURL splits 'tag1+stars:<3+tag2' into ['tag1', 'stars:<3', 'tag2']", function() {
		equals(converter.findTokensInURL('tag1+stars:<3+tag2'), ['tag1', 'stars:<3', 'tag2']);
	});


	test("Search input ['<3*' 'Tag1'] builds a search query 'stars:<3+Tag1'", function() {
		equals(converter.inputToQuery(['<3*', 'Tag1']), 'stars:<3+Tag1');
	});

	test("queryToInput builds from URL 'stars:<3+Tag1+Tag2' a unicodified tag list ['<★★★☆☆', 'foo', 'bar']", function() {
			equals(converter.queryToInput('stars:<3+Tag1+Tag2'),
				['<★★★☆☆', 'foo', 'bar']);
	});

});
