/** section Dialog
 * Dialog.Options
 * 
 * Global options for dialogs.
**/
Dialog.Options = Object.extend({
	assetPrefix: '',
	stylesheetPath: '/stylesheets/protototo/dialogs.css',
	busyImage: '/images/protototo/loading.gif',
	overlayOpacity: 0.75,
	transitionDuration: 0.4,
	defaultWidth: 400
}, window.DialogOptions || {});
