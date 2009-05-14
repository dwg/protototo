/**
 * == Prototype extensions ==
 * Additions to the Prototype library.
**/

(function() {
	var ie = navigator.userAgent.match(/MSIE\s(\d)+/);
	if (ie) {
		var version = parseInt(ie[1]);
		Prototype.Browser['IE' + version] = true;
		Prototype.Browser.ltIE7 = version < 7;
	}
})();

/** section: Prototype extensions
 * Event
**/
Object.extend(Event, {
	/**
	 *  Event.stopper(event) -> undefined
	 *  - event (Event): an event object
	 *  
	 *  A generic event handler that stops bubbling
	**/
	stopper: function(event) {
		if (event && Object.isFunction(event.stop)) event.stop();
	}
});