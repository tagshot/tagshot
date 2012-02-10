/* 
 */

Tagshot.sourceselect = (function () {
	init();

	function init() {
		$.getJSON("/sources.json", function (json){
			var data = {'sources': json};
			var selectElement = Mustache.to_html($("#sources-template").html(), data);
			$(".source-select").html(selectElement);
		});
	}

	/*********************
	 * API Functions
	 * *******************/
	return {
		init: init
	};
})();


