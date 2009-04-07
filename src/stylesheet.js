Stylesheet = {
	include: function(path) {
		if (!Stylesheet.isIncluded(path)) {
			$$('head').first().appendChild(Stylesheet.linkTo(path));
		}
	},
	
	isIncluded: function(path) {
		return !!Stylesheet.findLink(path);
	},
	
	findLink: function(path) {
		return $$('link[href*=' + path + ']').first();
	},
	
	linkTo: function(path, media) {
		media = media || 'screen'; 
		return new Element('link', {
			type: 'text/css', rel: 'stylesheet',
			'media': media, href: path
		});
	}
}