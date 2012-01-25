module('starMe');


/********************************************
* DOM tests
*********************************************/

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


/********************************************
* Callback tests
*********************************************/

test('Clicking on the first star changes rating to 1 and draws 1 black and 4 white stars',  function() {
	$('#qunit-fixture').starMe({});
	$('#qunit-fixture > a:first').click();
	equal($("#qunit-fixture > a:first").text(), '★');
	$("#qunit-fixture > a:not(:first-child)").each(function(i) {
		equal($(this).text(), '☆')});
	});

test('Callback func gets called when last star was clicked', function() {
	var called = false;
	$('#qunit-fixture').starMe({'ratingFunc': function(stars) {
			called = true;
			equal(stars, 5);
			console.log(stars);
		}});
	equal(called, false);
	$('#qunit-fixture > a:last').click();
	equal(called, true);
});

