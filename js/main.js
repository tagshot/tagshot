var uiSettings = {
	searchBoxText: 'Start searching…'
};

$(function () {
	var searchBox = document.getElementById('search-box');
	searchBox.value = uiSettings.searchBoxText;

	searchBox.focus();
	setCaretPosition(searchBox, 0);

	$("#search-box").keydown(function(event) {
		var text  = this.value,
		    input = $(this);
		if (text === uiSettings.searchBoxText) {
			input.removeClass('search-start').val('');
		}
	}).keyup(function() {
		var text  = this.value,
		    input = $(this);
		if (text === '') {
			input.addClass('search-start').val(uiSettings.searchBoxText);
			setCaretPosition(this, 0);
		}
	});

});

function setCaretPosition(ctrl, pos) {
	ctrl.focus();
	ctrl.setSelectionRange(pos,pos);
}
