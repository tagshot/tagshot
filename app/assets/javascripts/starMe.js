/* This plugin appends star links to a given DOM parent
 * Arguments: 
 *		starCount 	= number of full stars to be set
 *		starMax 		= sum of stars to be set. 
 *		ratingFunc	= callback which gets the new number of stars and can save it to the model
 *
 *	This plugin places starCount options.fullStars and starMax - starCount empty stars. 
 *	Each separated with a non breaking space.
 *	It sets full stars on click in the view and the should sync that to the model
 *
 * Tests:
 * 		This plugin is (or will be) thoroughly tested in starMeTest.js
 */

(function( $ ){

  $.fn.starMe = function(options) {

		var defaults = {
			starCount: 	0,
			starMax: 		5,
			emptyStar:	'☆',
			fullStar: 	'★',
			titles : 		['bad', 'poor', 'regular', 'good', 'gorgeous'],	
			ratingFunc: function(newStarCount) {
				console.log("New star count ", newStarCount)
			},
		};

		var options = $.extend({}, defaults, options);

		var self = this;

		function replaceStars(elem){
			elem.text(options.fullStar);
			elem.prevAll().text(options.fullStar);
			elem.nextAll().text(options.emptyStar);
		};

		function mouseOverFunc () {
			replaceStars($(this));	// dead code
		};

		function clickFunc (evt) {
			replaceStars($(this));
			var newStarCount = evt.data.param;
			options.ratingFunc(newStarCount);
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
			_.each(_.range(options.starCount), function(i) {
				appendLink(options.fullStar, options.titles[i], i);
			});
		};

		function buildEmptyStars() {
			_.each(_.range(options.starMax -  options.starCount), function(i) { 
				appendLink(options.emptyStar, options.titles[i], i);
			});
		};


		return this.each(function() {
			buildFullStars();
			buildEmptyStars();
		});
	}
})( jQuery );
