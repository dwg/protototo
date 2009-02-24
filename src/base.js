Prototype.Browser.ltIE7 = Prototype.Browser.IE && parseFloat(navigator.appVersion.split('MSIE')[1]) < 7;

Object.extend(Object, {
	serialExtend: function(first) {
		var args = $A(arguments).slice(1);
		return args.inject(first, function(acc, o) {
			return Object.extend(acc, o);
		});
	}
});