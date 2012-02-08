$(document).ready(function() {

	module("Helpers.js");

	test("equalArrays considers ['a', 'b'] and ['a', 'b'] equal", function() {
		ok(['a', 'b'].equals(['a', 'b']), true);
	});

	test("equalArrays does not consider ['a', 'b'] and ['b', 'a'] equal", function() {
		equals(['a', 'b'].equals(['b', 'a']), false);
	});

	test("equalArrays does not consider ['a', 'b', 'c'] and ['a', 'b', 'd'] equal", function() {
		equals(['a', 'b', 'c'].equals(['a', 'b', 'd']), false);
	});

	test("equalArrays recognizes nested arrays", function() {
		ok([['', 'tag1'], ['+', 'tag2'], [',', 'tag3'], ['+', 'tag4']].equals([['', 'tag1'], ['+', 'tag2'], [',', 'tag3'], ['+', 'tag4']]));
	});
});
