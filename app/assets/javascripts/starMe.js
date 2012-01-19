/* This plugin appends star links to a given DOM parent
 * Arguments: 
 *		starCount = number of full stars to be set
 *		starMax 	= sum of stars to be set. 
 *		This plugin places starCount fullStars and starMax - starCount empty stars. 
 *		Each separated with a non breaking space.
 */

(function( $ ){

  $.fn.starMe = function(starCount, starMax) {  

		var self = this;
		var emptyStar = '&#9734;';
		var fullStar = '&#9733;'
		var hints = ['bad', 'poor', 'regular', 'good', 'gorgeous'];

		var buildLink = function(star, hint) {
			foo = '<a class = "asdf" href="#" title="' + hint + '">' + star + '<a/>'
			return foo;
		}

		var insertSpace = function() {
			$(self).append('&nbsp;');
		}

		var buildFullStars = function() {
			_.each(_.range(starCount), function(i) {
				$(self).append(buildLink(fullStar, hints[i]));
				insertSpace();
			});
		};

		var buildEmptyStars = function() {
			_.each(_.range(starMax), function(i) {
				$(self).append(buildLink(emptyStar, hints[i]));
				insertSpace();
			});
		};


		return this.each(function() {
			buildFullStars();
			buildEmptyStars();
		});
	}
})( jQuery );
