
$(function () {
	var gallery = Tagshot.Views.PhotoListView.prototype;
	$(document).bind('keydown', 'ctrl+a', gallery.selectAll);
	$(document).bind('keydown', 'meta+a', gallery.selectAll);
});
