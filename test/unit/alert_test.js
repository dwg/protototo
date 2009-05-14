new Test.Unit.Runner({
	testShouldBeModal: function() {
		var dialog = new Dialog.Alert();
		this.wait(500, function() {
			this.assertVisible('dialog-overlay');
			dialog.close();
			this.wait(500, Prototype.emptyFunction);
		});
	},
	
	testShouldHaveACloseButton: function() {
		var dialog = new Dialog.Alert();
		this.wait(500, function() {
			var button = dialog.dialog.down('.dialog-buttons').down();
			this.assertNotUndefined(button);
			this.assertEqual('Close', button.innerHTML);
			Event.simulateClick(button);
			this.wait(500, function() {
				this.assertHidden(dialog.dialog);
			});
		});
	},
	
	testDialogAlert: function() {
		var dialog = Dialog.alert('foo');
		this.wait(500, function() {
			this.assertVisible(dialog.dialog);
			this.assertEqual('foo', dialog.contents.innerHTML);
			dialog.close();
			this.wait(500, Prototype.emptyFunction);
		});
	}
});