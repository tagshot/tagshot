Array.prototype.equals = function (arr) {
    if (this.length != arr.length) return false;
    return this.reduce(function (acc, el, i) {
        if (_.isArray(el)) return acc && el.equals(arr[i]);
        return acc && el === arr[i];
    }, true)};


Tagshot.helpers = (function(){

	var resizeImages = function () {
		var value  = $("#thumbnail-size-slider").slider("value");

			if (value%10 == 0) {
					$(document).scroll();
			}

		$("#backbone-gallery-view div.image-frame").css(
			'height',value).css(
			'width',function(){
				return value*1.5;
			}
		);

		if (value <= 150) {
			$("#backbone-gallery-view div.image-frame").addClass("smaller");
		}
		else {
			$("#backbone-gallery-view div.image-frame").removeClass("smaller");
		}
	};

	// Show loading image whenever an AJAX request is sent and hide whenever an request returns.
	var addGlobalAjaxIndicator = function () {
		var indicator = $('#loading-image');

		$("body").ajaxSend(function() {
			indicator.stop(true,true).fadeIn(50);
		});

		$("body").ajaxStop(function() {
			indicator.delay(500).fadeOut(100);
		});
	};


	var message = function(message, time) {
    Tagshot.helpers.genericMessage(message,time,false);
	};


	var error = function(error, time) {
    Tagshot.helpers.genericMessage(error,time,true);
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
		resizeImages : resizeImages,
		addGlobalAjaxIndicator: addGlobalAjaxIndicator,
		message: message,
		error: error,
		genericMessage: genericMessage
	};
})();
