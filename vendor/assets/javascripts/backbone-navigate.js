//= require backbone

/*
 * reguires the jquery hotkey plugin by jresig
 */

(function(){
	var hashStrip = /^#*/;

	_.extend(Backbone.History.prototype, {

		navigate : function(fragment, triggerRoute) {
		  var scrolllocation = [window.scrollX, window.scrollY];

		  var frag = (fragment || '').replace(hashStrip, '');
		  if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;
		  if (this._hasPushState) {
			var loc = window.location;
			if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
			this.fragment = frag;
			window.history.replaceState({scroll:scrolllocation}, document.title, document.location);
			window.history.pushState({}, document.title, loc.protocol + '//' + loc.host + frag);
		  } else {
			window.location.hash = this.fragment = frag;
			if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
			  this.iframe.document.open().close();
			  this.iframe.location.hash = frag;
			}
		  }
		  if (triggerRoute) this.loadUrl(fragment);
		}
	});

	_.extend(Backbone.History.prototype, {
		checkUrl : function(e) {
		  var current = this.getFragment();
		  if (current == this.fragment && this.iframe) current = this.getFragment(this.iframe.location.hash);
		  if (current == this.fragment || current == decodeURIComponent(this.fragment)) return false;
		  if (this.iframe) this.navigate(current);
		  this.loadUrl() || this.loadUrl(window.location.hash);

		  var scroll = e.originalEvent.state.scroll;
		  window.scrollTo(scroll[0],scroll[1]);
		},
	});
})();
