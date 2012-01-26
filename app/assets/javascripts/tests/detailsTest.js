$(document).ready(function() {

	module("Module Tags");

	test("details view is visible", function() {
		ok($('#backbone-detail-view').is(':visible'));
	});
});
