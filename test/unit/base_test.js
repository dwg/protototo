new Test.Unit.Runner({
	setup: function() {
		this.close = function(dialog) {
			this.wait(500, function() {
				dialog.close();
				this.wait(500, Prototype.emptyFunction);
			});
		}.bind(this)
	},
	
	testShouldCreateElements: function() {
		var tester = new Dialog.Base();
		var dialogs = $$('.dialog');
		this.assert(dialogs.size() == 1);
		this.assertIdentical(tester.dialog, dialogs.first());
		this.assert(dialogs.first().childElements().size() == 2);
		var dialogContent = dialogs.first().childElements().first();
		this.assert(dialogContent.hasClassName('dialog-content'));
		this.assertIdentical(tester.contents, dialogContent);
		var buttonPanel = dialogs.first().childElements().last();
		this.assert(buttonPanel.hasClassName('dialog-buttons'));
		this.assertIdentical(tester.buttonPanel.element, buttonPanel);
		this.close(tester);
	},
	
	testShouldSetIdAndClass: function() {
		var tester = new Dialog.Base({id: 'foo', className: 'bar'});
		var dialog = $('foo');
		this.assertIdentical(tester.dialog, dialog);
		this.assert(dialog.hasClassName('bar'));
		this.close(tester);		
	},
	
	testShouldRespectWidth: function() {
		var tester = new Dialog.Base({width: 300});
		this.assertEqual((300).px(), tester.dialog.getStyle('width'));
		this.close(tester);
	},
	
	testShouldShowModeless: function() {
		var tester = new Dialog.Base();
		this.wait(500, function() {
			this.assertVisible(tester.dialog, 'Expected dialog to be visible');
			this.assertNotVisible($('dialog-overlay'), 'Expected overlay to not be visible');
			this.close(tester);
		});
	},
	
	testShouldShowModal: function() {
		var tester = new Dialog.Base({modal: true});
		this.wait(700, function() {
			this.assert(tester.dialog.visible(), 'Expected dialog to be visible');
			this.assert($('dialog-overlay').visible(), 'Expected overlay to be visible');
			this.close(tester);
		});
	},
	
	testShouldHideModeless: function() {
		var tester = new Dialog.Base();
		this.wait(500, function() {
			tester.close();
			this.wait(500, function() {
				this.assertHidden(tester.dialog);
				this.assert(!tester.dialog.descendantOf(document.body));
				this.assertHidden($('dialog-overlay'));
			});
		});
	},
	
	testShouldHideModal: function() {
		var tester = new Dialog.Base({modal: true});
		this.wait(700, function() {
			tester.close();
			this.wait(700, function() {
				this.assertHidden(tester.dialog);
				this.assert(!tester.dialog.descendantOf(document.body));
				this.assertHidden($('dialog-overlay'));
			});
		});
	},
	
	testShouldRemoveElemensWhenClosing: function() {
		var tester = new Dialog.Base();
		this.wait(500, function() {
			tester.close();
			this.wait(500, function() {
				this.assertIdentical(0, $$('.dialog').size());
			});
		});
	},
	
	testShouldShowElement: function() {
		var element = new Element('p').update('A paragraph.');
		var dialog = new Dialog.Base({content: element});
		this.wait(500, function() {
			this.assertIdentical(element, dialog.contents.down());
			dialog.close();
			this.wait(500, Prototype.emptyFunction);
		});
	},
	
	testShouldShowString: function() {
		var dialog = new Dialog.Base({content: 'A string.'});
		this.wait(500, function() {
			this.assertEqual('A string.', dialog.contents.innerHTML);
			dialog.close();
			this.wait(500, Prototype.emptyFunction);
		});
	},
	
	testShouldShowHTML: function() {
		var dialog = new Dialog.Base({content: '<p>Another paragraph.</p>'});
		this.wait(500, function() {
			this.assertElementMatches(dialog.contents.down(), 'p');
			this.assertEqual('Another paragraph.', dialog.contents.down().innerHTML);
			dialog.close();
			this.wait(500, Prototype.emptyFunction);
		});
	}
});
