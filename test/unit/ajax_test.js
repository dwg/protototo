new Test.Unit.Runner({
	testShouldShowAjaxContent: function() {
		var dialog = new Dialog.Ajax('/response?responseBody=<p>Lorem ipsum</p>');
		this.wait(500, function() {
			this.assertEqual('<p>Lorem ipsum</p>', dialog.contents.innerHTML);
			dialog.close();
			this.wait(500, Prototype.emptyFunction);
		});
	},
	
	testShouldCloseOnFailure: function() {
		var dialog = new Dialog.Ajax('/bogus');
		this.wait(1000, function() {
			this.assert(!dialog.dialog.visible());
		});
	},
	
	testShouldShowLoadingImage: function() {
		var dialog = new Dialog.Ajax('/slow');
		this.wait(500, function() {
			this.assertEqual('img', dialog.dialog.tagName.toLowerCase());
			this.wait(1600, function() {
				this.assertNotEqual('img', dialog.dialog.tagName.toLowerCase());
				dialog.close();
				this.wait(500, Prototype.emptyFunction);
			});
		});
	}
});