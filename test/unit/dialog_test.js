var FakeDialog = (function() {
	var idCounter = 1;
	return Class.create(Dialog.Interface, {
		initialize: function(modal) {
			this.id = 'dialog-' + idCounter++;
			this.dialog = {
				setStyle: function(style) {
					this.z = style.zIndex;
				}.bind(this),
				getStyle: function() {return this.z;}.bind(this),
				identify: function() {return this.id;}.bind(this)
			};
			this.modal = modal;
		},
		
		close: Prototype.emptyFunction,
		getFrame: function() {return this.dialog;},
		isModal: function() {return this.modal}
	});
})();

new Test.Unit.Runner({
	testShouldLinkStylesheets: function() {
		this.assert(Stylesheet.linked(Dialog.Options.assetPrefix + Dialog.Options.stylesheetPath));
		if (Prototype.Browser.IE) {
			this.assert(Stylesheet.linked(Dialog.Options.assetPrefix + Dialog.Options.ieStylesheetPath));
			if (Prototype.Browser.ltIE7) {
				this.assert(Stylesheet.linked(Dialog.Options.assetPrefix + Dialog.Options.ie6StylesheetPath));
			}
		}
	},
	
	testShouldCreateOverlay: function() {
		this.assert($('dialog-overlay'));
		this.assertHidden($('dialog-overlay'));
	},
	
	testOverlay: function() {
		var dialog1 = new FakeDialog(true);
		Dialog.register(dialog1);
		this.wait(200, function() {
			this.assertVisible($('dialog-overlay'));
			var dialog2 = new FakeDialog(true);
			Dialog.register(dialog2);
			this.assertVisible($('dialog-overlay'));
			Dialog.unregister(dialog2);
			this.wait(200, function() {
				this.assertVisible($('dialog-overlay'));
				Dialog.unregister(dialog1);
				this.wait(200, function() {
					this.assertHidden($('dialog-overlay'));
				});
			});
		});
	},
	
	testLaterDialogShouldBeOnTopOfPrevious: function() {
		var d1 = new FakeDialog();
		var d2 = new FakeDialog();
		Dialog.register(d1);
		Dialog.register(d2);
		this.assert(d2.z > d1.z);
		Dialog.unregister(d1);
		Dialog.unregister(d2);
	},
	
	testOverlayShouldCoverPreviousDialogs: function() {
		var d1 = new FakeDialog(true);
		var d2 = new FakeDialog(true);
		Dialog.register(d1);
		this.wait(200, function() {
			Dialog.register(d2);
			var overlayZ = $('dialog-overlay').getStyle('zIndex');
			this.assert(overlayZ > d1.z);
			Dialog.unregister(d2);
			overlayZ = $('dialog-overlay').getStyle('zIndex');
			this.assert(overlayZ < d1.z);
			Dialog.unregister(d1);
			this.wait(200, Prototype.emptyFunction);
		});
	}
});