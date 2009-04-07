new Test.Unit.Runner({
	testFindLink: function() {
		var stylesheet = $$('link[href=fixtures/stylesheet.css]').first();
		this.assertIdentical(stylesheet, Stylesheet.findLink('fixtures/stylesheet.css'));
		this.assertIdentical(stylesheet, Stylesheet.findLink('stylesheet.css'));
	},
	
	testIsIncluded: function() {
		this.assert(Stylesheet.isIncluded('fixtures/stylesheet.css'));
	},
	
	testLinkTo: function() {
		var link = Stylesheet.linkTo('foo.css');
		this.assertEqual('LINK', link.tagName);
		this.assertEqual('text/css', link.type);
		this.assertEqual('stylesheet', link.rel);
		this.assertEqual('screen', link.media);
		this.assertMatch(/foo\.css$/, link.href);
		
		link = Stylesheet.linkTo('bar.css', 'print');
		this.assertEqual('LINK', link.tagName);
		this.assertEqual('text/css', link.type);
		this.assertEqual('stylesheet', link.rel);
		this.assertEqual('print', link.media);
		this.assertMatch(/bar\.css$/, link.href);
	},
	
	testInclude: function() {
		Stylesheet.include('foo.css');
		this.assert(Stylesheet.isIncluded('foo.css'));
	}
});