if (typeof PDoc === "undefined") window.PDoc = {};

// Poor-man's history manager. Polls for changes to the hash.
(function() {  
	var PREVIOUS_HASH = null;
	
	Event.observe(window, "load", function() {    
		var hash = window.location.hash;
		if (hash && hash !== PREVIOUS_HASH) {
			document.fire("hash:changed", {
				previous: PREVIOUS_HASH, current: hash
			});        
			PREVIOUS_HASH = hash;      
		}
		window.setTimeout(arguments.callee, 100);  
	});  
})();

// Place a "frame" around the element described by the hash.
// Update the frame when the hash changes.
PDoc.highlightSelected = function() {
	if (!window.location.hash) return;  
	element = $(window.location.hash.substr(1));
	if (element) PDoc.highlight(element.up('li, div'));
};

document.observe("hash:changed", PDoc.highlightSelected);

PDoc.highlight = function(element) {
	var self = arguments.callee;
	if (!self.frame) {
		self.frame = new Element('div', { 'class': 'highlighter' });
		document.body.appendChild(self.frame);
	}
	
	var frame = self.frame;
	
	element.getOffsetParent().appendChild(frame);
	
	var offset = element.positionedOffset(),
		d = element.getDimensions();

	frame.setStyle({
		position: 'absolute',
		top: (offset.top - 15) + 'px',
		left: (offset.left - 12) + 'px',
		width:  (d.width + 20) + 'px',
		height: (d.height + 30) + 'px'
	});
	
	// Defer this call because Safari hasn't yet scrolled the viewport.
	(function() {
		var frameOffset = frame.viewportOffset(frame);
		if (frameOffset.top < 0) {
			window.scrollBy(0, frameOffset.top - 10);
		}
	}).defer();
};

if (typeof CodeHighlighter !== 'undefined') {
	CodeHighlighter.addStyle('ebnf', {
		instance: {
			exp: /#/
		},
		optional: {
			exp: /\[[^\]]+\]/ // literal arrays ?
		},
		undefined: {
			exp: /\bundefined\b/
		},
		returns: {
			exp: /\u21d2/
		},
		keywords: {
			exp: /\b(new|null)\b/
		},
		dollar: {
			exp: /\$/
		}
	});
}