var FakeDialog = Class.create({
	initialize: function() {
		this.dialog = {
			setStyle: function(style) {
				this.z = style.zIndex;
			}.bind(this)
		};
	}
});

new Test.Unit.Runner({
	testShouldLinkStylesheets: function() {
		this.assert(Stylesheet.linked(Dialog.Options.assetPrefix + Dialog.Options.stylesheetPath));
		if (Prototype.Browser.IE) {
			this.assert(Stylesheet.isLinked(Dialog.Options.assetPrefix + Dialog.Options.ieStylesheetPath));
			if (Prototype.Browser.ltIE7) {
				this.assert(Stylesheet.isLinked(Dialog.Options.assetPrefix + Dialog.Options.ie6StylesheetPath));
			}
		}
	},
	
	testShouldCreateOverlay: function() {
		this.assert($('dialog-overlay'));
		this.assertHidden($('dialog-overlay'));
	},
	
	testOverlay: function() {
		var dialog1 = new FakeDialog();
		Dialog.registerModalDialog(dialog1);
		this.wait(200, function() {
			this.assertVisible($('dialog-overlay'));
			var dialog2 = new FakeDialog();
			Dialog.registerModalDialog(dialog2);
			this.assertVisible($('dialog-overlay'));
			Dialog.unregisterModalDialog(dialog2);
			this.wait(200, function() {
				this.assertVisible($('dialog-overlay'));
				Dialog.unregisterModalDialog(dialog1);
				this.wait(200, function() {
					this.assertHidden($('dialog-overlay'));
				});
			});
		});
	},
	
	testNotificationFromOpener: function() {
		var body = $$('body').first();
		var firer = new FakeDialog();
		firer.opener = body;
		var fired = false;
		var listener = function(event) {
			fired = true;
			this.assertEqual(event.memo.foo, 'bar');
		}.bindAsEventListener(this);
		body.observe('dialog:foo', listener);
		Dialog.notify(firer, 'foo', {foo: 'bar'});
		this.assert(fired);
		body.stopObserving('dialog:foo', listener);
	},
	
	testNotificationFromDocument: function() {
		var fired = false;
		var listener = function(event) {
			fired = true;
			this.assertEqual(event.memo.foo, 'bar');
		}.bindAsEventListener(this);
		document.observe('dialog:foo', listener);
		Dialog.notify(new FakeDialog(), 'foo', {foo: 'bar'});
		this.assert(fired);
	},
	
	testLaterDialogShouldBeOnTopOfPrevious: function() {
		var d1 = new FakeDialog();
		var d2 = new FakeDialog();
		Dialog.registerDialog(d1);
		Dialog.registerDialog(d2);
		this.assert(d2.z > d1.z);
		Dialog.unregisterDialog(d1);
		Dialog.unregisterDialog(d2);
	},
	
	testOverlayShouldCoverPreviousDialogs: function() {
		var d1 = new FakeDialog();
		var d2 = new FakeDialog();
		Dialog.registerModalDialog(d1);
		this.wait(200, function() {
			Dialog.registerModalDialog(d2);
			var overlayZ = $('dialog-overlay').getStyle('zIndex');
			this.assert(overlayZ > d1.z);
			Dialog.unregisterModalDialog(d2);
			overlayZ = $('dialog-overlay').getStyle('zIndex');
			this.assert(overlayZ < d1.z);
			Dialog.unregisterModalDialog(d1);
			this.wait(200, Prototype.emptyFunction);
		});
	}
});