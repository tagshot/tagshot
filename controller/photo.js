App = {
	models : {},
	views : {},
	collections : {},
	init : function () {
		App.collections.photoList = new App.models.PhotoList();
		App.collections.photoList.fetch({success : function () {
			var view = new App.views.PhotoListView({
				collection : App.collections.photoList
			});
			view.render();
			// TODO remove, currently for debugging
			this.view = view;
		}});
	}
};

$(document).ready(App.init);

/*

App.collections.photoList.get(42).save(
{"iptc":{
	"stars" : {
		"nr": 3, 
		"of": 10
	}
}
}); 

*/

