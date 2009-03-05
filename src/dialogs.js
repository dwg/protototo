Dialogs = {
	REQUIRED_PROTOTYPE: '1.6.0.3',

	convertVersionString: function(versionString) {
		var v = versionString.replace(/_.*|\./g, '');
		v = parseInt(v + '0'.times(4-v.length));
		return versionString.indexOf('_') > -1 ? v-1 : v;
	}
};

if((typeof Prototype=='undefined') || (typeof Element == 'undefined') ||
  (typeof Element.Methods=='undefined') ||
  (Dialogs.convertVersionString(Prototype.Version) < Dialogs.convertVersionString(Dialogs.REQUIRED_PROTOTYPE))) {
	throw("dialogs requires the Prototype JavaScript framework >= " + Dialogs.REQUIRED_PROTOTYPE);
}

// NOTE: consider scriptaculous style loading of features

<%= include 'base.js' %>

<%= include 'stylesheet.js' %>

<%= include 'dialog.js' %>

<%= include 'buttons.js' %>

<%= include 'alert.js' %>

<%= include 'confirm.js' %>

<%= include 'lightbox.js' %>

<%= include 'flash.js' %>