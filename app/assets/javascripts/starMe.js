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
		var emptyStar = '☆';
		var fullStar = '★';
		var titles = ['bad', 'poor', 'regular', 'good', 'gorgeous'];

		var clickFunc = function() {
			$(this).text(fullStar);
		};


		var buildLink = function(star, title, id) {
			return '<a class = "star" id= star-"' + id + '" href="#" title="' + title + '">' + star + '</a>'
		};

		var insertSpace = function() {
			$(self).append('&nbsp;');
		};

		var appendLink = function(starChar, title, id) {
			$(self).append(buildLink(starChar, title, id));
			$(self).children().click(clickFunc);
			insertSpace();
		};

		var buildFullStars = function() {
			_.each(_.range(starCount), function(i) {
				appendLink(fullStar, titles[i], i);
			});
		};

		var buildEmptyStars = function() {
			_.each(_.range(starMax -  starCount), function(i) { 
				appendLink(emptyStar, titles[i], i);
			});
		};


		return this.each(function() {
			buildFullStars();
			buildEmptyStars();
		});
	}
})( jQuery );
