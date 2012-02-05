$(document).ready(function() {

	module("Helpers.js");

	test("equalArrays considers ['a', 'b'] and ['a', 'b'] equal", function() {
		equals(Tagshot.helpers.equalArrays(['a', 'b'], ['a', 'b']), true);
	});

		test("equalArrays does not consider ['a', 'b'] and ['b', 'a'] equal", function() {
		equals(Tagshot.helpers.equalArrays(['a', 'b'], ['b', 'a']), false);
	});

	test("equalArrays considers [null, undefined] and [null, undefined] equal", function() {
		equals(Tagshot.helpers.equalArrays([null, undefined], [null, undefined]), true);
	});

	test("equalArrays recognizes nested arrays", function() {
		equals(Tagshot.helpers.equalArrays([['', 'tag1'], ['+', 'tag2'], [',', 'tag3'], ['+', 'tag4']], [['', 'tag1'], ['+', 'tag2'], [',', 'tag3'], ['+', 'tag4']]), true);
	});
});
