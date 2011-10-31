var uiSettings = {
	searchBoxText: 'Just start searching…'
};

$(function () {
	var list = [
		"JavaScript",
		"Haskell",
		"Lisp",
		"Scheme",
		"Java"
	];
	$("#search-box").tagAutocomplete({
		autocompleteList: proglag,
		inputCssClass: 'textbox'
	}).textboxFocusOnStart({
		text: uiSettings.searchBoxText,
		cssClassWhenEmpty: 'search-start'
	});
	
	$(".star-me").star();
});

function setCaretPosition(ctrl, pos) {
	ctrl.focus();
	ctrl.setSelectionRange(pos,pos);
}


