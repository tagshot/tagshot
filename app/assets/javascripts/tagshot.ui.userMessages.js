Tagshot.ui.userMessages = (function() {

	var info = function(message, time) {
		Tagshot.ui.userMessages.genericMessage(message,time,false);
	};

	var error = function(error, time) {
		Tagshot.ui.userMessages.genericMessage(error,time,true);
	};

	var genericMessage = function(message, time, alerted) {
	var mb = $("#message-board");
	if (alerted) {
		mb.addClass("alerted");
	} else {
		mb.removeClass("alerted");
	}
	mb.html(message).stop(true, true).slideDown(200).delay(time).slideUp(100);
	};

	return {
		info: info,
		error: error,
		genericMessage: genericMessage
	};
})();
