//= require <prototype>
//= prefer <effects>

/*  Dialogs JavaScript framework, version <%= DIALOGS_VERSION %>
 *  (c) 2009 Arni Einarsson
 *
 *  Dialogs is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------*/

//= provide "../assets"

Dialogs = {
	Version: '<%= DIALOGS_VERSION %>',
	MinimumPrototypeVersion: '<%= REQUIRED_PROTOTYPE %>'
};

(function() {
	var undef;
	
	function parse(versionString) {
		var v = versionString.replace(/_.*|\./g, '');
		v = parseInt(v + '0'.times(4-v.length));
		return versionString.indexOf('_') > -1 ? v-1 : v;
	}
	
	if(Prototype === undef || Element === undef || Element.Methods === undef ||
	  parse(Prototype.Version) < parse(Dialogs.MinimumPrototypeVersion)) {
		throw('Dialogs requires the Prototype JavaScript framework version ' + Dialogs.MinimumPrototypeVersion + ' or greater');
	}
})();

//= require "lang"
//= require "stylesheet"

Object.extend(Dialogs, {
	dialogs: [],
	modalDialogs: [],
	
	init: function() {
		
	}
});

//= require "dialog"