/* 
 * Between helper method.
 *
 */
between = function(a,b,c) {
	var max = _.max([a,b]);
	var min = _.min([a,b]);
	return (min <= c && c <= max && c!=a);
}
