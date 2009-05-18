new Test.Unit.Runner({
	testShouldCreateTitleElement: function() {
		var d = new Dialog.Titled();
		this.wait(500, function() {
			this.assertIdentical($$('.dialog-title').first(), d.title);
			d.close(),
			this.wait(500, Prototype.emptyFunction);
		});
	},
	
	testShouldSetTitle: function() {
		var d = new Dialog.Titled({title: 'Foo'});
		this.wait(500, function() {
			this.assertEqual('Foo', d.title.innerHTML);
			d.setTitle('Bar');
			this.assertEqual('Bar', d.title.innerHTML);
			d.close(),
			this.wait(500, Prototype.emptyFunction);
		});
	},
	
	testShouldNotBeDraggableByDefault: function() {
		if (!Prototype.Browser.Gecko) {
			this.info('Only supported in Firefox');
		} else {
			var d = new Dialog.Titled();
			this.wait(500, function() {
				this.assert(!d.draggable);
				var pos = {top: d.dialog.getStyle('top'), left: d.dialog.getStyle('left')};
				Event.simulateMouse(d.title, 'mousedown', {pointerX: parseFloat(pos.left), pointerY: parseFloat(pos.top)});
				Event.simulateMouse(d.title, 'mousemove', {pointerX: 10, pointerY: 10});
				Event.simulateMouse(d.title, 'mouseup', {pointerX: 10, pointerY: 10});
				this.assertIdentical(pos.top, d.dialog.getStyle('top'));
				this.assertIdentical(pos.left, d.dialog.getStyle('left'));
				d.close(),
				this.wait(500, Prototype.emptyFunction);
			});
		}
	},
	
	testShouldOptionallyBeDraggable: function() {
		if (!Prototype.Browser.Gecko) {
			this.info('Only supported in Firefox');
		} else {
			var d = new Dialog.Titled({draggable: true});
			this.wait(500, function() {
				this.assert(!d.draggable);
				var pos = {top: d.dialog.getStyle('top'), left: d.dialog.getStyle('left')};
				Event.simulateMouse(d.title, 'mousedown', {pointerX: parseFloat(pos.left), pointerY: parseFloat(pos.top)});
				Event.simulateMouse(d.title, 'mousemove', {pointerX: 10, pointerY: 10});
				Event.simulateMouse(d.title, 'mouseup', {pointerX: 10, pointerY: 10});
				this.assertEqual(10, parseInt(d.dialog.getStyle('top')), 'Expected top to be 10px');
				this.assertEqual(10, parseInt(d.dialog.getStyle('left')), 'Expected left to be 10px');
				d.close(),
				this.wait(500, Prototype.emptyFunction);
			});
		}
	}
});