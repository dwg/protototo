/** section Dialog
 * Dialog.Options
 * 
 * Global options for dialogs.
**/
Dialog.Options = Object.extend({
	assetPrefix: '',
	stylesheetPath: '/stylesheets/proto-dialogs/dialogs.css',
	spinnerImage: '/images/proto-dialogs/loading.gif',
	overlayOpacity: 0.85
}, window.DialogOptions || {});
