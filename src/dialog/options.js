/** section Dialog
 * Dialog.Options
 * 
 * Global options for dialogs.
 */
Dialog.Options = Object.extend({
	assetPrefix: '',
	stylesheetPath: '/stylesheets/dialogs/dialogs.css',
	ieStylesheetPath: '/stylesheets/dialogs/dialogs_ie.css',
	ie6StylesheetPath: '/stylesheets/dialogs/dialogs_ie6.css',
	overlayOpacity: 0.85
}, window.DialogOptions || {});