/* This plugin appends star links to a given DOM parent
 * Arguments: 
 *		starCount 	= number of full stars to be set
 *		starMax 		= sum of stars to be set. 
 *		ratingFunc	= callback which sets the new number of stars in the model
 *
 *	This plugin places starCount fullStars and starMax - starCount empty stars. 
 *	Each separated with a non breaking space.
 *	It sets full stars on click in the view and the should sync that to the model
 *
 * Tests:
 * 		This plugin is (or will be) thoroughly tested in starMeTest.js
 */

(function( $ ){

  $.fn.starMe = function(starCount, starMax, ratingFunc) {

		var self = this;
		var emptyStar = '☆';
		var fullStar = '★';
		var titles = ['bad', 'poor', 'regular', 'good', 'gorgeous'];

		var ratingFunc = ratingFunc || function(x) {console.log("New star count", x.data.param)};

		function replaceStars(elem){
			elem.text(fullStar);
			elem.prevAll().text(fullStar);
			elem.nextAll().text(emptyStar);
		};

		function mouseOverFunc () {
			replaceStars($(this));	// dead code
		};

		function clickFunc (evt) {
			replaceStars($(this));
			var newStarCount = evt.data.param;
			ratingFunc(newStarCount);
		};

		function buildLink(star, title, id) {
			return '<a class = "star" id= star-"' + id + '" href="#" title="' + title + '">' + star + '</a>'
		};

		function insertSpace() {
			$(self).append('&nbsp;');
		}

		function appendLink (starChar, title, id) {
			$(self).append(buildLink(starChar, title, id));
			insertSpace();
			$(self).children().bind('click', { param: id }, clickFunc);
			//$(self).children().bind('mouseenter', mouseOverFunc);
		};

		function buildFullStars() {
			_.each(_.range(starCount), function(i) {
				appendLink(fullStar, titles[i], i);
			});
		};

		function buildEmptyStars() {
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
