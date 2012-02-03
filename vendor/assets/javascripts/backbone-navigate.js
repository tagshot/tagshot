//= require backbone

/*
 * reguires the jquery hotkey plugin by jresig
 */

/*(function(){

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
		},

				 // Save a fragment into the hash history, or replace the URL state if the
				 // 'replace' option is passed. You are responsible for properly URL-encoding
				 // the fragment in advance.
				 //
				 // The options object can contain `trigger: true` if you wish to have the
				 // route callback be fired (not usually desirable), or `replace: true`, if
				 // you which to modify the current URL without adding an entry to the history.
				 navigate: function(fragment, options) {
					 if (!historyStarted) return false;
					 if (!options || options === true) options = {trigger: options};
					 var frag = (fragment || '').replace(routeStripper, '');
					 if (this.fragment == frag || this.fragment == decodeURIComponent(frag)) return;

					 // If pushState is available, we use it to set the fragment as a real URL.
					 if (this._hasPushState) {
						 if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
						 this.fragment = frag;
						 window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

						 // If hash changes haven't been explicitly disabled, update the hash
						 // fragment to store history.
					 } else if (this._wantsHashChange) {
						 this.fragment = frag;
						 this._updateHash(window.location, frag, options.replace);
						 if (this.iframe && (frag != this.getFragment(this.iframe.location.hash))) {
							 // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
							 // When replace is true, we don't want this.
							 if(!options.replace) this.iframe.document.open().close();
							 this._updateHash(this.iframe.location, frag, options.replace);
						 }

						 // If you've told us that you explicitly don't want fallback hashchange-
						 // based history, then `navigate` becomes a page refresh.
					 } else {
						 window.location.assign(this.options.root + fragment);
					 }
					 if (options.trigger) this.loadUrl(fragment);
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
			console.log("Scrolled: ", scroll);
		},
	});
})();*/
