Stylesheet = {
	include: function(path) {
		if (Stylesheet.isIncluded(path)) return;
		$$('head').first().appendChild(Stylesheet.linkTo(path));
	},
	
	isIncluded: function(path) {
		return !!Stylesheet.findLink(path);
	},
	
	findLink: function(path) {
		return $$('link').detect(function(l) {
			return new RegExp(path).test(l.readAttribute('href'));
		});
	},
	
	linkTo: function(path, media) {
		media = media || 'screen'; 
		return new Element('link', {
			type: 'text/css', rel: 'stylesheet',
			'media': media, href: path
		});
	}
}