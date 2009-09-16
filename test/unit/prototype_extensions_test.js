new Test.Unit.Runner({
	testCenterInViewport: function() {
		var vpDims = document.viewport.getDimensions();
		$('center_in_viewport').centerInViewport();
		this.assertEqual('absolute', $('center_in_viewport').getStyle('position'));
		this.assertEqual((vpDims.height/2 - 50).px(), $('center_in_viewport').getStyle('top'));
		this.assertEqual((vpDims.width/2 - 50).px(), $('center_in_viewport').getStyle('left'));
		$('center_in_viewport').centerInViewport({minLeft: 1000, minTop: 1000});
		this.assertEqual('1000px', $('center_in_viewport').getStyle('top'));
		this.assertEqual('1000px', $('center_in_viewport').getStyle('left'));
	},
	
	testFillDocument: function() {
		var vpDims = document.viewport.getDimensions();
		$('fill_document').fillDocument();
		this.assertEqual(vpDims.width.px(), $('fill_document').getStyle('width'));
		this.assertEqual(vpDims.height.px(), $('fill_document').getStyle('height'));
	},
	
	testGetInnerDimensions: function() {
		var innerDims = $('inner_dims').getInnerDimensions();
		this.assertEqual(100, innerDims.width);
		this.assertEqual(100, innerDims.height);
	},
	
	testSetWidth: function() {
		$('fix_width').setWidth();
		this.assertEqual('100px', $('fix_width').getStyle('width'));
		$('explicit_width').setWidth(200);
		this.assertEqual('200px', $('explicit_width').getStyle('width'));
	},
	
	testSetHeight: function() {
		$('fix_height').setHeight();
		this.assertEqual('100px', $('fix_height').getStyle('height'));
		$('explicit_height').setHeight(200);
		this.assertEqual('200px', $('explicit_height').getStyle('height'));
	},
	
	testSetDimensions: function() {
		$('fix_dims').setDimensions();
		this.assertEqual('100px', $('fix_dims').getStyle('width'));
		this.assertEqual('100px', $('fix_dims').getStyle('height'));
		$('explicit_dims').setDimensions({width: 200, height: 200});
		this.assertEqual('200px', $('explicit_dims').getStyle('width'));
		this.assertEqual('200px', $('explicit_dims').getStyle('height'));
	}
});
