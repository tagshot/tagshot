module('starMe');

test('starMe({"starCount":3}) adds 3 full and 5 - 3 = 2 empty stars as links to the DOM', function() {
	$('#qunit-fixture').starMe({'starCount':3});
	equal($("#qunit-fixture > a").size(), 5);
});

test('starMe({"starCount":3,"starMax":9) adds 6 full and 9-6=3 empty star elements to the DOM', function() {
	$('#qunit-fixture').starMe({'starCount':3,'starMax':9});
	equals($('#qunit-fixture > a').size(), 9);
});

test('starMe adds at least a link with class="star", first' +"'"+ 's'+' title="bad"', function() {
	$('#qunit-fixture').starMe({'starCount':3});
	ok($('#qunit-fixture').has('a').length);	//has at least a link
	equal($("#qunit-fixture > a:first").attr("class"), 'star');
	equal($("#qunit-fixture > a:first").attr("title"), 'bad');
});
