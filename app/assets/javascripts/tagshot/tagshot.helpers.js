/*
 * Generic helper functions
 * ================================================================================
 * This module currently only offers on method to check, whether two arrays are
 * equal.
 * This module is tested in tests/helpersTest.js
 */

/*
 * Check if two arrays are equal.
 * Works even on nested arrays.
 * Usage:
 *     >> [1, [2, [3, 4]]].equals([1, [2, [3, 4]]]
 *     true
 */
Array.prototype.equals = function (arr) {
	if (this.length != arr.length) return false;
	return this.reduce(function (acc, el, i) {
	if (_.isArray(el)) return acc && el.equals(arr[i]);
	return acc && el === arr[i];
}, true)};
