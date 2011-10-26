var uiSettings = {
	searchBoxText: 'Start searching…'
};

$(function () {
	var searchBox = document.getElementById("search-box");
	searchBox.value = uiSettings.searchBoxText;

	searchBox.focus();
	setCaretPosition(searchBox, 0);

	$("#search-box").keydown(function() {
		var text = this.value;
		var input = $(this);
		if (text === uiSettings.searchBoxText) {
			input.removeClass("search-start");
			this.value = '';
		}
	}).keyup(function() {
		//alert(this.value);
	});

});

function setCaretPosition(ctrl, pos){
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}
