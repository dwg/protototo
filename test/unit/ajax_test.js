Element.addMethods({
	getOverflow: function(element) {
		element = $(element);
		var value = element.style.overflow;
	    if (!value || value == 'auto') {
	      var css = document.defaultView.getComputedStyle(element, null);
	      value = css ? css.overflow : null;
	    }
		return value;
	}
});

new Test.Unit.Runner({
	testShouldLoadContent: function() {
		var d = new Dialog.Ajax({path: '../fixtures/short.html'});
		this.wait(1500, function() {
			this.assertMatch(/Lorem ipsum/, d.contents.innerHTML);
			d.close();
			this.wait(700, Prototype.emptyFunction);
		});
	},
	
	testShouldOnlyShowLoading: function() {
		var d = new Dialog.Ajax({path: '/slow'});
		this.wait(700, function() {
			var img = d.contents.down();
			this.assertNotNullOrUndefined(img);
			this.assertMatch(/loading.gif$/, img.src);
			this.assertHidden(d.buttons);
			this.wait(2500, function() {
				d.close();
				this.wait(700, Prototype.emptyFunction);
			});
		});
	},
	
	testShouldScrollWhenHeightMoreThanSpecified: function() {
		var d = new Dialog.Ajax({path: '../fixtures/long.html', height: 200});
		this.wait(1500, function() {
			this.assertEqual('auto', d.contents.getOverflow());
			d.close();
			this.wait(700, Prototype.emptyFunction);
		});
	},
	
	testShouldNotScrollWhenHeightLessThanSpecified: function() {
		var d = new Dialog.Ajax({path: '../fixtures/short.html', height: 400});
		this.wait(1500, function() {
			this.assertNotEqual('auto', d.contents.getOverflow());
			d.close();
			this.wait(700, Prototype.emptyFunction);
		});
	},
	
	testShouldShowFailureMessageOnFailure: function() {
		var d = new Dialog.Ajax({path: '/not-there'});
		this.wait(1500, function() {
			this.assertEqual(Dialog.Options.Ajax.failureMessage, d.contents.innerHTML);
			d.close();
			this.wait(700, Prototype.emptyFunction);
		});
	}
});