Tagshot.Views.AjaxError = Backbone.View.extend({
		initialize: function() {
			$(document).ajaxError(function(e, xhr, options){
				if(xhr.status==0){
					alert('You are offline!!\n Please Check Your Network.');
				} else if(xhr.status==404){
					alert('Requested URL not found.');
				} else if(xhr.status==500){
					alert('Internal Server Error.');
				} else if(e=='parsererror'){
					alert('Error.\nParsing JSON Request failed.');
				} else if(e=='timeout'){
					alert('Request Time out.');
				} else {
					alert('Unknow Error.\n'+xhr.responseText);
				}
			});
		},
});
