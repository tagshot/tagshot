(function($) {
	$.fn.star = function() {
		this.each(function() {
			var stars = $(this).text().split("/");
			var blacks = parseInt(stars[0]);
			var whites = parseInt(stars[1]) - blacks;

			var blackstar = "<a href='#'>&#9733;</a>";
			var whitestar = "<a href='#'>&#9734;</a>";

			var buildString = function(star, count) {
				starString = "";
				for(var i=0; i<count; i++) {
					starString = starString + " " + star;
				};
				return starString;
			};

			var blackstars = buildString(blackstar, blacks);
			var whitestars = buildString(whitestar, whites);

			$(this).html(blackstars+whitestars);
		})
	}
})(jQuery)
