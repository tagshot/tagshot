Array.prototype.equals = function (arr) {
	if (this.length != arr.length) return false;
	return this.reduce(function (acc, el, i) {
	if (_.isArray(el)) return acc && el.equals(arr[i]);
	return acc && el === arr[i];
}, true)};
