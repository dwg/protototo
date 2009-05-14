/**
 * == Dialog ==
 * Classes utilizing the dialogs framework to provide dialog like
 * behavior.
**/

/** section: Dialog
 * Dialog
**/
var Dialog = {};

//= require "dialog/options"

(function() {
	var undef;
	
	function prefix(path) {
		return Dialog.Options.assetPrefix + path;
	}
	
	function linkStylesheets() {
		new Stylesheet(prefix(Dialog.Options.stylesheetPath)).link();
		if (Prototype.Browser.IE) new Stylesheet(prefix(Dialog.Options.ieStylesheetPath)).link();
		if (Prototype.Browser.ltIE7) new Stylesheet(prefix(Dialog.Options.ie6StylesheetPath)).link();
	}
	
	function createElements() {
		var overlay = new Element('div', {id: 'dialog-overlay'}).hide();
		$$('body').first().insert(overlay);
		if (!Dialog.effects) overlay.setOpacity(Dialog.Options.overlayOpacity);
		if (Prototype.Browser.ltIE7) {
			overlay.appendChild(new Element('iframe'));
			Dialog.overlayObserver = function() {
				var pageDims = document.viewport.getDimensions();
				var vertScroll = document.viewport.getScrollOffsets().top;
				overlay.setStyle({
					position: 'absolute', top: vertScroll.px(), left: '0',
					width: pageDims.width.px(), height: pageDims.height.px()
				});
			};
			Element.observe(window, 'scroll', Dialog.overlayObserver);
			Element.observe(window, 'resize', Dialog.overlayObserver);
			Element.observe(window, 'unload', function() {
				Element.stopObserving(window, 'scroll', Dialog.overlayObserver);
				Element.stopObserving(window, 'resize', Dialog.overlayObserver);
			});
		}
	}
	
	/**
	 *  Dialog.init() -> undefined
	 * 
	 *  Initializes the Dialogs library
	**/
	function init() {
		linkStylesheets();
		createElements();
		Dialog.effects = window.Effect !== undef;
	}
	
	/**
	 *  Dialog.defaultQueue() -> Object
	 * 
	 *  Returns the default effects queue options for dialogs
	**/
	function defaultQueue() {
		var position = arguments[0] || 'end';
		return {position: position, scope: 'dialogs'};
	}
	
	var dialogs = [];
	var modalDialogs = [];
	var maxZ = 10;
	
	function coverScreen() {
		var overlay = $('dialog-overlay');
		if (overlay.visible()) return;
		overlay.setStyle({zIndex: ++maxZ});
		if (Dialog.effects) {
			overlay.appear({
				from: 0, to: Dialog.Options.overlayOpacity,
				duration: 0.15, queue: defaultQueue()
			});
		} else {
			overlay.show();
		}
	}
	
	function releaseScreen() {
		var overlay = $('dialog-overlay');
		if (!overlay.visible()) return;
		if (Dialog.effects) {
			overlay.fade({
				duration: 0.15, queue: defaultQueue()
			});
		} else {
			overlay.hide();
		}
	}
	
	/**
	 *  Dialog.registerDialog(dialog) -> undefined
	 *  - dialog (Dialog.Base): the dialog to register
	**/
	function registerDialog(dialog) {
		dialog.dialog.setStyle({zIndex: ++maxZ});
		dialogs.push(dialog);
	}
	
	/**
	 *  Dialog.unregisterDialog(dialog) -> undefined
	 *  - dialog (Dialog.Base): the dialog to unregister
	**/
	function unregisterDialog(dialog) {
		dialogs = dialogs.without(dialog);
	}
	
	/**
	 *  Dialog.registerModalDialog(dialog) -> undefined
	 *  - dialog (Dialog.Base): the dialog to register
	 *  
	 *  Will cover the screen with an overlay
	**/
	function registerModalDialog(dialog) {
		if (modalDialogs.size() == 0) {
			coverScreen();
		} else {
			$('dialog-overlay').setStyle({zIndex: ++maxZ});
		}
		dialog.dialog.setStyle({zIndex: ++maxZ});
		modalDialogs.push(dialog);
	}
	
	/**
	 *  Dialog.unregisterModalDialog(dialog) -> undefined
	 *  - dialog (Dialog.Base): the dialog to unregister
	 *  
	 *  Will remove overlay cover if last modal dialog,
	 *  otherwise will make next modal dialog available
	**/
	function unregisterModalDialog(dialog) {
		modalDialogs = modalDialogs.without(dialog);
		if (modalDialogs.size() == 0) {
			releaseScreen();
		} else {
			modalDialogs.last().dialog.setStyle({zIndex: maxZ});
		}
	}
	
	/**
	 *  Dialog.notify(dialog, eventName[, eventParams]) -> undefined
	 *  - dialog (Dialog.Base): the notifying dialog
	 *  - eventName: (String): the name of the notifying event
	 *  - eventParams: (Object): parameters to be passed with the event
	 *  
	 *  Will fire an event named 'dialog:`eventName`' originating at
	 *  `dialog.opener` if defined, at `document` otherwise.
	**/
	function notify(dialog, eventName) {
		var memo = Object.extend({dialog: dialog}, arguments[2] || {});
		if (dialog.opener) {
			dialog.opener.fire('dialog:' + eventName, memo);
		} else {
			document.fire('dialog:' + eventName, memo);
		}
	}
	
	/**
	 *  Dialog.log(kind, message) -> undefined
	 *  - kind (String): the kind of message to log (info, warning, error)
	 *  - message (String): the message to log
	 *  
	 *  Designed to be used with the firebug console but will work as long
	 *  as `console` and `console[kind]` are defined.
	**/
	function log(kind, message) {
		if (console && console[kind]) {
			console[kind](message);
		}
	}
	
	Object.extend(Dialog, {
		init: init,
		defaultQueue: defaultQueue,
		registerDialog: registerDialog,
		unregisterDialog: unregisterDialog,
		registerModalDialog: registerModalDialog,
		unregisterModalDialog: unregisterModalDialog,
		notify: notify,
		log: log,
		info: log.curry('info'),
		warn: log.curry('warn'),
		error: log.curry('error')
	});
})();

document.observe('dom:loaded', Dialog.init);

//= require "dialog/base"
//= require "dialog/buttons"
//= require "dialog/alert"
//= require "dialog/confirm"

//= require "dialog/titled"

//= require "dialog/ajax"