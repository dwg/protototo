/** section Dialog
 * Dialog.Options
 * 
 * Global options for dialogs.
 */
Dialog.Options = Object.extend({
	assetPrefix: '',
	stylesheetPath: '/stylesheets/proto-dialogs/dialogs.css',
	ieStylesheetPath: '/stylesheets/proto-dialogs/dialogs_ie.css',
	ie6StylesheetPath: '/stylesheets/proto-dialogs/dialogs_ie6.css',
	overlayOpacity: 0.85
}, window.DialogOptions || {});
