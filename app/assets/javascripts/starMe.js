/* This plugin appends star links to a given DOM parent
 * Arguments: 
 *		starCount 	= number of full stars to be set
 *		starMax 		= sum of stars that can be set.
 *		ratingFunc	= callback which gets the new number of stars and can save it
 *
 *	This plugin places starCount options.fullStars and starMax - starCount empty stars. 
 *	Each separated with a non breaking space.
 *	It sets full stars on click in the view and the ratingFunc should sync that to the model
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


/********************************************
* Insert links with stars on given DOM node
*********************************************/

		function buildFullStars() {
			_.each(_.range(options.starCount), function(i) {
				appendLink(options.fullStar, options.titles[i], i);
			});
		}

		function buildEmptyStars() {
			_.each(_.range(options.starMax -  options.starCount), function(i) {
				appendLink(options.emptyStar, options.titles[i]);
			});
		}

		function appendLink (starChar, title) {
			$(self).append(buildLink(starChar, title));
			insertSpace();
		}


		function buildLink(star, title) {
			return '<a class = "star" ' + 'href="#" title="' + title + '">' + star + '</a>'
		}

		function insertSpace() {
			$(self).append('&nbsp;');
		}


/***********************************
* Attaching and handling of events
************************************/

		function attachClickHandler() {
			$(self).children().click(clickFunc);
		}

		function clickFunc () {
			replaceStars($(this));
			var newStarCount = options.starMax - $(this).nextAll().length;
			console.log("Hi, I'm the click handler, new star count: ", newStarCount);
			options.ratingFunc(newStarCount);
		}

		function replaceStars(elem){
			elem.text(options.fullStar);
			elem.prevAll().text(options.fullStar);
			elem.nextAll().text(options.emptyStar);
		}


/********************************************
* High level logic here
*********************************************/

		return this.each(function() {
			buildFullStars();
			buildEmptyStars();
			attachClickHandler();
		});


	}
})( jQuery );
