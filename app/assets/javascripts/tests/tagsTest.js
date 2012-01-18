$(document).ready(function() {

	module("Module Tags");

	test("starString builds maximum 5 white stars", function() {
		var min = tagHelpers.starString('', 5);
		var max = tagHelpers.starString('', 0);
		equal(max, '☆☆☆☆☆', '5 white stars');
		equal(min, '★★★★★', 'No white but 5 black stars');
	});

	test("starExpression builds up to 9 stars", function() {
		var longStarString = tagReplace.starExpression('9*');
		equals(longStarString.length, 9, 'There are 9 black stars');
	});

	test("starExpression parses <=3*", function() {
		equals(tagReplace.starExpression('<=3*'), '≤★★★☆☆');
	});

	test("starExpression parses >=3*", function() {
		equals(tagReplace.starExpression('>=3*'), '≥★★★☆☆');
	});

	test("=3* and 3* are equal", function() {
	equals(tagReplace.starExpression('=3*'), tagReplace.starExpression('3*'));
	});


});
