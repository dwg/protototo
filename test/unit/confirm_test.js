new Test.Unit.Runner({
	testShouldHaveTwoButtons: function() {
		var dialog = new Dialog.Confirm();
		this.wait(700, function() {
			var buttonPanel = dialog.dialog.down('.dialog-buttons');
			this.assertIdentical(2, buttonPanel.childElements().size());
			dialog.close();
			this.wait(700, Prototype.emptyFunction);
		});
	},
	
	testPositiveFeedback: function() {
		var clicked = false;
		var dialog = Dialog.confirm('Is it true?', function(positive) {
			clicked = true;
			this.assert(positive);
		}.bind(this));
		this.wait(700, function() {
			var yes = dialog.dialog.down('.dialog-buttons').childElements().detect(function(e) {return e.innerHTML == 'Yes'});
			Event.simulateClick(yes);
			this.wait(700, function() {
				this.assert(clicked);
			});
		});
	},
	
	testNegativeFeedback: function() {
		var clicked = false;
		var dialog = Dialog.confirm('Is it false?', function(positive) {
			clicked = true;
			this.assert(!positive);
		}.bind(this));
		this.wait(700, function() {
			var yes = dialog.dialog.down('.dialog-buttons').childElements().detect(function(e) {return e.innerHTML == 'No'});
			Event.simulateClick(yes);
			this.wait(700, function() {
				this.assert(clicked);
			});
		});
	}
});