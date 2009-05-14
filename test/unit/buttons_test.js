new Test.Unit.Runner({
	testShouldNotAddButtonPanelWhenNoButtons: function() {
		var tester = new Dialog.Buttons();
		this.wait(500, function() {
			this.assertUndefined(tester.dialog.down('.dialog-buttons'));
			tester.close();
			this.wait(500, Prototype.emptyFunction);
		});
	},
	
	testShouldAddButtonPanelWhenButtons: function() {
		var tester = new Dialog.Buttons({buttons: [{text: 'foo', onclick: Prototype.emptyFunction}]});
		this.wait(500, function() {
			var buttonPanel = tester.dialog.down('.dialog-buttons');
			this.assertNotUndefined(buttonPanel);
			var button = buttonPanel.down();
			this.assertNotUndefined(button);
			this.assertElementMatches(button, 'a');
			tester.close();
			this.wait(500, Prototype.emptyFunction);
		});
	},
	
	testShouldCloseDialogWhenClosingButtonClicked: function() {
		var tester = new Dialog.Buttons({buttons: [{text: 'foo', onclick: Event.stopper, close: true}]});
		this.wait(500, function() {
			var button = tester.dialog.down('.dialog-buttons').down();
			Event.simulateClick(button);
			this.wait(500, function() {
				this.assertHidden(tester.dialog);
			});
		});
	},
	
	testShouldRenderByTemplate: function() {
		var tester = new Dialog.Buttons({buttons: [{text: 'bla', onclick: Prototype.emptyFunction, className: 'bar'}]});
		this.wait(500, function() {
			var buttonPanel = tester.dialog.down('.dialog-buttons');
			var button = buttonPanel.down();
			this.assertElementMatches(button, 'a.bar');
			this.assertEqual('bla', button.innerHTML);
			tester.close();
			this.wait(500, function() {
				var tester2 = new Dialog.Buttons({
					buttons: [{text: 'blu', onclick: Prototype.emptyFunction, className: 'bar'}],
					template: new Template('<a href="#">#{text}</a>')
				});
				this.wait(500, function() {
					var buttonPanel = tester2.dialog.down('.dialog-buttons');
					var button = buttonPanel.down();
					this.assert(!button.hasClassName('bar'));
					this.assertEqual('blu', button.innerHTML);
					tester2.close();
					this.wait(500, Prototype.emptyFunction);
				});
			});
		});
	},
	
	testShouldAcceptOverridableButtonConfig: function() {
		var tester = new Dialog.Buttons({
			fooText: 'foo',
			onFoo: Prototype.emptyFunction,
			fooClass: 'bar'
		});
		this.wait(500, function() {
			var buttonPanel = tester.dialog.down('.dialog-buttons');
			var button = buttonPanel.down();
			this.assertNotUndefined(button);
			this.assertElementMatches(button, 'a.bar');
			this.assertEqual('foo', button.innerHTML);
			tester.close();
			this.wait(500, Prototype.emptyFunction);
		});
	}
});