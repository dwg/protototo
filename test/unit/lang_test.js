new Test.Unit.Runner({
	testSerialExtend: function() {
		var object1 = {foo: 'foo', bar: [1, 2, 3]};
		var object2 = {baz: 'baz', boo: [4, 5, 6]};
		this.assertIdentical(object1, Object.serialExtend(object1, object2, {baz: 'bazz'}));
		this.assertHashEqual({foo: 'foo', bar: [1, 2, 3], baz: 'baz', boo: [4, 5, 6]},
			Object.serialExtend({}, object1, object2));
	}
});