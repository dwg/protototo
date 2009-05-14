//= require <prototype>
//= prefer <effects>
//= provide "../assets"

/*  Dialogs JavaScript framework, version <%= DIALOGS_VERSION %>
 *  (c) 2009 Arni Einarsson
 *
 *  Dialogs is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------*/

var Dialogs = {
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
	
	if(window.Prototype === undef || window.Element === undef || Element.Methods === undef ||
	  parse(Prototype.Version) < parse(Dialogs.MinimumPrototypeVersion)) {
		throw('Dialogs requires the Prototype JavaScript framework version ' + Dialogs.MinimumPrototypeVersion + ' or greater');
	}
})();

//= require "lang"
//= require "prototype_extensions"
//= require "tools"
//= require "dialog"