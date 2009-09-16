/**
 * == Language ==
 * Additions to JavaScript's "standard library" and extensions to
 * built-in JavaScript objects.
**/

/** section: Language
 * class Object
 *  
 *  Extensions to the built-in `Object` object.
**/
Object.extend(Object, {
	/**
	 *  Object.extendAll(destination[, source...]) -> Object
	 *  - destination (Object): The object to receive the new properties.
	 *  - source (Object): One or more object whose properties will be duplicated.
	 *
	 *  Copies all properties from each of the sources to the destination object. Returns
	 *  the destination object.
	**/
	extendAll: function() {
		var args = $A(arguments), first = args.shift();
		return args.inject(first, function(acc, o) {
			return Object.extend(acc, o);
		});
	}
});

/** section: Language
 * class String
 *  
 *  Extensions to the built-in `String` class.
**/
Object.extend(String.prototype, {
	/**
	 *  String#px() -> String
	 *  
	 *  Returns a new string with 'px' appended to the end unless this string already ends
	 *  with 'px', in which case it returns the string unchanged.
	**/
	px: function() {
		return this.endsWith('px') ? this : this + 'px';
	}
});

/** section: Language
 * class Number
 *  
 *  Extensions to the built-in `Number` class.
**/
Object.extend(Number.prototype, {
	/**
	 *  Number#px() -> String
	 *  
	 *  Returns a string representation of this number with the string 'px' appended
	 *  to the end.
	**/
	px: function() {
		return this.toString().px();
	}
});
