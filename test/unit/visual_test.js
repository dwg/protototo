new Test.Unit.Runner({
	testOverlayCoversSelects: function() {
		var dialog = Dialog.alert('Overlay should cover select.');
		this.wait(500, function() {
			var result = confirm('Is the select element showing through the overlay?');
			this.assert(!result);
			dialog.close();
			this.wait(500, Prototype.emptyFunction);
		});
	}
});
