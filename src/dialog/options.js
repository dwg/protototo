/** section: Core
 *  Dialog.Options -> Object
 *  
 *  Global options for dialogs.
 *  Overridable by defining `DialogOptions` before loading the protototo library.
**/
Dialog.Options = Object.extend({
	assetPrefix: '',
	stylesheetPath: '/stylesheets/protototo/dialogs.css',
	busyImage: '/images/protototo/loading.gif',
	overlayOpacity: 0.75,
	transitionDuration: 0.4,
	defaultWidth: 400
}, window.DialogOptions || {});
