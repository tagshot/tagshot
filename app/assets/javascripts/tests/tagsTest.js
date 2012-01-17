$(document).ready(function(){

	module("Module Tags");

	test("starString builds maximum 5 white stars", function() {
		var min = tags.helpers.starString('', 5);
		var max = tags.helpers.starString('', 0);
		equal(max, '☆☆☆☆☆', '5 white stars');
		equal(min, '★★★★★', 'No white but 5 black stars');
	});

	test("starExpression builds up to 9 stars", function() {
		var longStarString = tags.replace.starExpression('9*');
		equals(longStarString.length, 9, 'There are 9 black stars');
	});

});
