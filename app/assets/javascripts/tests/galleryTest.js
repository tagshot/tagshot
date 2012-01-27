$(document).ready(function() {

	module("Module Tags");

	test("gallery view is visible", function() {
		ok($('#backbone-gallery-view').is(':visible'));
	});
});
