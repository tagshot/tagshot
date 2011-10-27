var uiSettings = {
	searchBoxText: 'Just start searching…'
};

$(function () {
	$("#search-box").textboxFocusOnStart({
		text: uiSettings.searchBoxText,
		cssClassWhenEmpty: 'search-start'
	});
});

function setCaretPosition(ctrl, pos) {
	ctrl.focus();
	ctrl.setSelectionRange(pos,pos);
}
