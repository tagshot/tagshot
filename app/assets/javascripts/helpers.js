Array.prototype.equals = function (arr) {
	if (this.length != arr.length) return false;
	return this.reduce(function (acc, el, i) {
	if (_.isArray(el)) return acc && el.equals(arr[i]);
	return acc && el === arr[i];
}, true)};

Tagshot.helpers = (function() {
	var resizeImages = function () {
		var value  = $("#thumbnail-size-slider").slider("value");

		// invoke infinite scrolling in case of resizing
		Tagshot.views.gallery.infiniteScrolling();
	
		cssRule = Tagshot.helpers.resizeCssRule();

		// use faster class rule if possible 
		if (cssRule !== undefined) {
			var width = value*1.5;
			var height = value;

			cssRule.style.width = width+"px";
			cssRule.style.height = height+"px";
		} else {
			console.log("resize fallback");
			$("#backbone-gallery-view div.image-frame").css(
					'height',value).css(
						'width',function(){
							return value*1.5;
						});
		}

		if (value <= 150) {
			$("#backbone-gallery-view div.image-frame").addClass("smaller");
		}
		else {
			$("#backbone-gallery-view div.image-frame").removeClass("smaller");
		}
	};

	var cachedResizeCssRule = undefined;

	var resizeCssRule = function() {
		if (Tagshot.helpers.cachedResizeCssRule === undefined) {
			var cssRule = false;
			var sheet;
			for (i = 0; i<document.styleSheets.length; i++) {
				sheet = document.styleSheets[i]
				cssRule = _.find(sheet.cssRules, function(a){return a.selectorText == "#backbone-gallery-view .image-frame"});
				if (cssRule != undefined)
					break;
			}
			Tagshot.helpers.cachedResizeCssRule = cssRule;
		}
		return Tagshot.helpers.cachedResizeCssRule;
	};

	// Show loading image whenever an AJAX request is sent and hide whenever an request returns.
	var addGlobalAjaxIndicator = function () {
		var indicator = $('#loading-image');

		$("body").ajaxSend(function () {
			indicator.stop(true, true).fadeIn(50);
		});

		$("body").ajaxStop(function () {
			indicator.delay(500).fadeOut(100);
		});
	};

	return {
		resizeImages : resizeImages,
		resizeCssRule : resizeCssRule,
		cachedResizeCssRule : cachedResizeCssRule,
		addGlobalAjaxIndicator: addGlobalAjaxIndicator
	};
})();
