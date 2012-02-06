Tagshot.Views.AjaxError = Backbone.View.extend({
		initialize: function() {
			$(document).ajaxError(function(e, xhr, options){
				if(xhr.status==0){
					Tagshot.helpers.error('You seem to be offline!!\n Please Check Your Network.', 3000);
				} else if(xhr.status==404){
					Tagshot.helpers.error('Requested URL not found.', 5000);
				} else if(xhr.status==500){
					console.error('Internal Server Error.');
				} else if(e=='parsererror'){
					console.error('Error.\nParsing JSON Request failed.');
				} else if(e=='timeout'){
					console.error('Request Time out.');
				} else {
					console.error('Unknow Error.\n'+xhr.responseText);
				}
			});
		},
});
