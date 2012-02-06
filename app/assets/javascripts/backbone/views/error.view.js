Tagshot.Views.AjaxError = Backbone.View.extend({
		initialize: function() {
			$(document).ajaxError(function(e, xhr, options){
				if(xhr.status==0){
					console.log('You are offline!!\n Please Check Your Network.');
				} else if(xhr.status==404){
					console.error('Requested URL not found.');
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
