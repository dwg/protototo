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

document.observe('dom:loaded', function() {
	Prototype.CSSFeatures = {
		PositionFixed: (function() {
			var isSupported = null;
			if (document.createElement) {
				var el = document.createElement("div");
				if (el && el.style) {
					el.style.width = "1px";
					el.style.height = "1px";
					el.style.position = "fixed";
					el.style.top = "10px";
					var root = document.body;
					if (root && root.appendChild && root.removeChild) {
						root.appendChild(el);
						isSupported = el.offsetTop === 10;
						root.removeChild(el);
					}
					el = null;
				}
			}
			return isSupported;
		})()
	};
});

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
	},
	
	observeAndStop: Element.observe.wrap(function(proceed, element, eventName, handler) {
		return proceed.call(proceed, element, eventName, function(e) {
			e.stop();
			handler.call(e.element(), e);
		});
	})
});

/** section: Prototype extensions
 * Element
**/
Object.extend(Element.Methods, {
	/**
	 *  Element.centerInViewport(@element[, options]) -> Element
	 *  - element (Element | String): the element or id of element to center.
	 *  - options (Object): Top and left boundaries, defaults to {minTop: -Infinity, minLeft: -Infinity}.
	 *  
	 *  Centers element in viewport. If no position has been specified (i.e. position is `undefined` or 'static')
	 *  will be absolutely positioned. 
	**/
	centerInViewport: function(element, options) {
		element = $(element);
		options = Object.extend({minLeft: -Infinity, minTop: -Infinity}, options || {});
		var vpDims = document.viewport.getDimensions(),
			vpOffsets = document.viewport.getScrollOffsets(),
			elDims = element.getDimensions(),
			prevPosition = element.getStyle('position'),
			newPosition = prevPosition === undefined || prevPosition == 'static' ? 'absolute' : prevPosition;
		element.setStyle({
			position: newPosition,
			left: [options.minLeft, (vpDims.width - elDims.width)/2 + vpOffsets.left].max().px(),
			top: [options.minTop, (vpDims.height - elDims.height)/2 + vpOffsets.top].max().px()
		});
		return element;
	},
	
	fillDocument: function(element) {
		element = $(element);
		var vpDims = document.viewport.getDimensions(),
			docDims = $(document.documentElement).getDimensions();
		element.setStyle({
			width: Math.max(vpDims.width, docDims.width).px(),
			height: Math.max(vpDims.height, docDims.height).px()
		});
		return element;
	},
	
	getInnerDimensions: function(element) {
		element = $(element);
		var dims = element.getDimensions(),
			width = $w('paddingLeft paddingRight borderLeftWidth borderRightWidth')
			.inject(dims.width, function(memo, style) {
				return memo - parseInt(element.getStyle(style), 10);
			}),
			height = $w('paddingTop paddingBottom borderTopWidth borderBottomWidth')
			.inject(dims.height, function(memo, style) {
				return memo - parseInt(element.getStyle(style), 10);
			});
		return Object.extend([width, height], {width: width, height: height});
	},
	
	getInnerWidth: function(element) {
		return Element.getInnerDimensions(element).width;
	},
	
	getInnerHeight: function(element) {
		return Element.getInnerDimensions(element).height;
	},
	
	/**
	 *  Element.setWidth(@element[, width]) -> Element
	 *  - element (Element | String): Element or id of element.
	 *  - width (Number): The desired width (defaults to current width of element).
	**/
	setWidth: function(element, width) {
		element = $(element);
		return element.setStyle({
			width: (Object.isUndefined(width) ? element.getInnerWidth() : width).px()
		});
	},
	
	/**
	 *  Element.setHeight(@element[, height]) -> Element
	 *  - element (Element | String): Element or id of element.
	 *  - width (Number): The desired height (defaults to current height of element).
	**/
	setHeight: function(element, height) {
		element = $(element);
		return element.setStyle({
			height: (Object.isUndefined(height) ? element.getInnerHeight() : height).px()
		});
	},
	
	/**
	 *  Element.setDimensions(@element[, dimensions]) -> Element
	 *  - element (Element | String): Element or id of element.
	 *  - dimensions (Object): The desired width and height (defaults to current dimensions of element).
	**/
	setDimensions: function(element, dimensions) {
		element = $(element);
		var innerDims = element.getInnerDimensions(),
			undef,
			width = Object.isUndefined(dimensions) ? undef : dimensions.width,
			height = Object.isUndefined(dimensions) ? undef : dimensions.height;
		return element.setStyle({
			width: (Object.isUndefined(width) ? innerDims.width : width).px(),
			height: (Object.isUndefined(height) ? innerDims.height : height).px()
		});
	}
});
Element.addMethods();
