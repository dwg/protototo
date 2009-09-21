/** section Dialog
 * Dialog.Options
 * 
 * Global options for dialogs.
**/
Dialog.Options = Object.extend({
	assetPrefix: '',
	stylesheetPath: '/stylesheets/proto-dialogs/dialogs.css',
	busyImage: '/images/proto-dialogs/loading.gif',
	overlayOpacity: 0.75,
	transitionDuration: 0.4,
	defaultWidth: 400
}, window.DialogOptions || {});
