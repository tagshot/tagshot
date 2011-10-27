(function($) {
	$.fn.star = function() {
		this.each(function() {
			// TODO
			// x/y Sterne auslesen
			// Sterne als Unicode einfügen, Sterne sind Text im Anchor, damit onClick abgefangen werden kann für irgendwelche Dinge
			var stars = $(this).text().split("/");
			console.log(stars);
		})
	}
})(jQuery)
