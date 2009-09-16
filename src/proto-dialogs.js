//= require <prototype>
//= prefer <effects>
//= provide "../assets"

/*  proto-dialogs
 *  JavaScript framework, version <%= PROTO_DIALOGS_VERSION %>
 *  (c) 2009 Arni Einarsson
 *
 *  proto-dialogs is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------*/

var ProtoDialogs = {
	Version: '<%= PROTO_DIALOGS_VERSION %>',
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
	  parse(Prototype.Version) < parse(ProtoDialogs.MinimumPrototypeVersion)) {
		throw('proto-dialogs requires the Prototype JavaScript framework version ' + ProtoDialogs.MinimumPrototypeVersion + ' or greater');
	}
})();

//= require "lang"
//= require "prototype_extensions"
//= require "tools"
//= require "dialog"