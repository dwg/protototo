Dialogs = {
	Version: '<%= DIALOGS_VERSION %>',
	MinimumPrototypeVersion: '<%= REQUIRED_PROTOTYPE %>',

	convertVersionString: function(versionString) {
		var v = versionString.replace(/_.*|\./g, '');
		v = parseInt(v + '0'.times(4-v.length));
		return versionString.indexOf('_') > -1 ? v-1 : v;
	}
};

if((typeof Prototype=='undefined') || (typeof Element == 'undefined') ||
  (typeof Element.Methods=='undefined') ||
  (Dialogs.convertVersionString(Prototype.Version) < Dialogs.convertVersionString(Dialogs.MinimumPrototypeVersion))) {
	throw("dialogs requires the Prototype JavaScript framework >= " + Dialogs.MinimumPrototypeVersion);
}

//= require "lang"
//= require "stylesheet"
//= require "dialog"