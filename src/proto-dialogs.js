//= provide "../assets"

/*  protototo
 *  JavaScript framework, version <%= PROTOTOTO_VERSION %>
 *  (c) 2009 Arni Einarsson
 *
 *  protototo is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------*/

var Protototo = {
	Version: '<%= PROTOTOTO_VERSION %>',
	MinimumPrototypeVersion: '<%= REQUIRED_PROTOTYPE %>'
};

(function() {
	var undef;
	
	function parse(versionString) {
		var v = versionString.replace(/_.*|\./g, '');
		v = parseInt(v + '0'.times(4 - v.length));
		return versionString.indexOf('_') > -1 ? v - 1 : v;
	}
	
	if(window.Prototype === undef || window.Element === undef || Element.Methods === undef ||
	  parse(Prototype.Version) < parse(Protototo.MinimumPrototypeVersion)) {
		throw('protototo requires the Prototype JavaScript framework version ' + Protototo.MinimumPrototypeVersion + ' or greater');
	}
})();

//= require "lang"
//= require "prototype_extensions"
//= require "tools"
//= require "dialog"