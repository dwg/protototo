new Test.Unit.Runner({
	testExtendAll: function() {
		var object1 = {foo: 'foo', bar: [1, 2, 3]};
		var object2 = {baz: 'baz', boo: [4, 5, 6]};
		this.assertIdentical(object1, Object.extendAll(object1, object2, {baz: 'bazz'}));
		this.assertHashEqual({foo: 'foo', bar: [1, 2, 3], baz: 'baz', boo: [4, 5, 6]},
			Object.extendAll({}, object1, object2));
	},
	
	testStringPx: function() {
		this.assertEqual('foopx', 'foo'.px());
		this.assertEqual('foopx', 'foopx'.px());
	},
	
	testNumberPx: function() {
		var num = 100;
		this.assertEqual('100px', num.px());
	}
});
