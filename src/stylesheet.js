Stylesheet = {
	include: function(path) {
		if (!Stylesheet.isIncluded(path)) {
			$$('head').first().appendChild(Stylesheet.linkTo(path));
		}
	},
	
	isIncluded: function(path) {
		return Stylesheet.findLink(path) != null;
	},
	
	findLink: function(path) {
		var name = this._extractNameFromPath(path);
		var links = $$('link[href*=' + path + ']').select(function(link) {
			return name == Stylesheet._extractNameFromPath(link.href);
		});
		if (links.size() > 1 && console && console.warn) {
			console.warn('Multiple links to stylesheet ' + name + ': ' + links.inspect());
		}
		return links.first() || null;
	},
	
	_extractNameFromPath: function(path) {
		var match = /[^\/]+\.css(?=\?|$)/.exec(path);
		if (match) {
			return match.first();
		} else {
			return null;
		}
	},
	
	linkTo: function(path, media) {
		media = media || 'screen'; 
		return new Element('link', {
			type: 'text/css', rel: 'stylesheet',
			'media': media, href: path
		});
	}
}