/** section: Tools
 *  class Stylesheet
 * 
 *  A class that allows inclusion of stylesheets and querying for the
 *  presence of stylesheets.
**/
var Stylesheet = Class.create({
	/**
	 *  new Stylesheet(path)
	 *  - path (String): A path to a stylesheet
	 * 
	 *  Creates a `Stylesheet` with the given path.
	**/
	initialize: function(path) {
		this.path = path;
	},
	
	/**
	 *  Stylesheet#link() -> undefined
	 *  
	 *  Creates a `link` tag with this `Stylesheet`s path and appends
	 *  it to the documents head unless it has already been linked.
	**/
	link: function() {
		Stylesheet.link(this.path);
	},
	
	/**
	 *  Stylesheet#linked() -> Boolean
	 *  
	 *  Returns true it there exists a `link` tag with this `Stylesheet`s
	 *  path in the document, false otherwise.
	**/
	linked: function() {
		return Stylesheet.linked(this.path);
	}
});

Stylesheet.KlassMethods = (function() {
	function extractNameFromPath(path) {
		var match = /[^\/]+\.css(?=\?|$)/.exec(path);
		if (match) {
			return match.first();
		}
		return null;
	}
	
	/**
	 *  Stylesheet.link(path) -> undefined
	 *  - path (String): A path to a stylesheet
	**/
	function link(path) {
		if (!linked(path)) {
			$$('head').first().appendChild(linkTo(path));
		}
	}
	
	/**
	 *  Stylesheet.linked(path) -> Boolean
	 *  - path (String): A path to a stylesheet
	**/
	function linked(path) {
		return findLink(path) != null;
	}
	
	/**
	 *  Stylesheet.findLink(path) -> Element
	 *  - path (String): A path to a stylesheet
	**/
	function findLink(path) {
		var name = extractNameFromPath(path),
			links = $$('link[href*=' + path + ']').select(function(link) {
				return name == extractNameFromPath(link.href);
			});
		if (links.size() > 1 && console && console.warn) {
			console.warn('Multiple links to stylesheet ' + name + ': ' + links.inspect());
		}
		return links.first() || null;
	}
	
	/**
	 *  Stylesheet.linkTo(path[, media = 'screen']) -> Element
	 *  - path (String): A path to a stylesheet
	 *  - media (String): The media type for which the stylesheet should be linked
	**/
	function linkTo(path, media) {
		return new Element('link', {
			type: 'text/css', rel: 'stylesheet',
			media: media || 'screen', href: path
		});
	}
	
	return {
		link: link,
		linked: linked,
		findLink: findLink,
		linkTo: linkTo
	};
})();
Object.extend(Stylesheet, Stylesheet.KlassMethods);
