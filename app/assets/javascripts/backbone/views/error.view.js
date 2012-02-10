//= require tagshot/tagshot.ui.userMessages

Tagshot.Views.AjaxError = Backbone.View.extend({
		initialize: function() {
			$(document).ajaxError(function(e, xhr, options){
				if(xhr.status==0){
					Tagshot.ui.messages.error('You seem to be offline!!\n Please Check Your Network.', 3000);
				} else if(xhr.status==404){
					Tagshot.ui.messages.error('Requested URL not found.', 5000);
				} else if(xhr.status==500){
					Tagshot.ui.messages.error('Internal Server Error.');
				} else if(e=='parsererror'){
					Tagshot.ui.messages.error('Error.\nParsing JSON Request failed.');
				} else if(e=='timeout'){
					Tagshot.ui.messages.error('Request Time out.');
				} else {
					Tagshot.ui.messages.error('Unknow Error.\n'+xhr.responseText);
				}
			});
		},
});
