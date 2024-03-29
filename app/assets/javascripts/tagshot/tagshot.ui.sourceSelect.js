/* Frontend Implementation of source selection, being the place to 
 * select the folder you want to see pictures from. 
 * ================================================================================ 
 * 
 * The user selects a source and the associated id is added to the search 
 * string according to the documented api. Since the search is added to the url,
 * the id will also be added to the url. Because of that we also have to be able to do 
 * it the ther way round. If the user opens a site, the url has to be parsed and the 
 * approriate selection in the ui has to be done. 
 */

Tagshot.ui.sourceSelect = (function () {
	function init() {
		$.getJSON("/sources.json", function (json){
			var data = {'sources': json};
			var selectElement = Mustache.to_html($("#sources-template").html(), data);
			$(".source-select").html(selectElement);
			setSources(Tagshot.collections.photoList.currentSources);

			$('#go-sources').click(apply);
		});	
	}

	function setSources(sources) {
		_.each(sources, function (id){
			$("option[value="+id+"]",".source-select").attr('selected',"selected");
		});

		Tagshot.collections.photoList.currentSources = sources;
	}

	function getSources() {
		var sources;
		sources = $(".source-select select").val();
		return sources;
	}

	function apply() {
		console.log("applying sources");
		Tagshot.collections.photoList.currentSources = getSources();

		var query = Tagshot.collections.photoList.buildQueryWithSources();
		if (query) {
			console.log(query);
			Tagshot.router.navigate("search/"+query, { trigger: true });
		}
	}

	/*********************
	 * API Functions
	 * *******************/
	return {
		init:        init,
		setSources:  setSources,
		apply:       apply
	};
})();


