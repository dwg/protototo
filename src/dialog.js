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
		Stylesheet.link(prefix(Dialog.Options.stylesheetPath));
	}
	
	function createOverlay() {
		Dialog.overlay = new Element('div', {id: 'dialog-overlay'}).hide().setStyle({
			backgroundColor: '#000', position: 'fixed',
			top: 0, right: 0, bottom: 0, left: 0 
		});
		$(document.body).insert(Dialog.overlay);
		if (!Dialog.effects) Dialog.overlay.setOpacity(Dialog.Options.overlayOpacity);
		if (Prototype.Browser.ltIE7) {
			// To hide select tags
			var iframe = new Element('iframe');
			iframe.style.cssText = 'display:none;position:absolute;top:0;left:0;z-index:-1;filter:mask();width:100%;height:100%;';
			Dialog.overlay.appendChild(iframe);
		}
		if (!Prototype.CSSFeatures.PositionFixed) {
			Dialog.overlayObserver = function() {
				Dialog.overlay.fillDocument().centerInViewport();
			};
			Element.observe(window, 'scroll', Dialog.overlayObserver);
			Element.observe(window, 'resize', Dialog.overlayObserver);
		}
	}
	
	/**
	 *  Dialog.init() -> undefined
	 * 
	 *  Initializes the Dialogs library
	**/
	function init() {
		Dialog.effects = window.Effect !== undef;
		linkStylesheets();
		createOverlay();
	}
	
	/**
	 *  Dialog.effectsQueue([position = 'end']) -> Object
	 *  - position (String): position of effect in queue
	 * 
	 *  Returns the default effects queue options for dialogs
	**/
	function effectsQueue() {
		var position = arguments[0] || 'end';
		return {position: position, scope: 'dialogs'};
	}
	
	var registry = new Hash(),
		dialogs = [],
		modals = [],
		maxZ = 100;
	
	function coverScreen() {
		var overlay = Dialog.overlay;
		overlay.setStyle({zIndex: ++maxZ});
		if (overlay.visible()) return;
		$(document.body).fire('screen:covered');
		if (Dialog.effects) {
			overlay.appear({
				from: 0, to: Dialog.Options.overlayOpacity,
				duration: 0.15, queue: effectsQueue()
			});
		} else {
			overlay.show();
		}
	}
	
	function releaseScreen() {
		var overlay = Dialog.overlay;
		if (!overlay.visible()) return;
		if (Dialog.effects) {
			overlay.fade({duration: 0.15, queue: effectsQueue()});
		} else {
			overlay.hide();
		}
		$(document.body).fire('screen:released');
	}
	
	/**
	 *  Dialog.register(dialog) -> undefined
	 *  - dialog (Dialog.Base): the dialog to register
	**/
	function register(dialog) {
		if (dialog.isModal()) {
			modals.push(dialog);
			coverScreen();
		}
		dialog.getFrame().setStyle({zIndex: ++maxZ});
		dialogs.push(dialog);
		registry.set(dialog.getFrame().identify(), dialog);
	}
	
	/**
	 *  Dialog.unregister(dialog) -> undefined
	 *  - dialog (Dialog.Base): the dialog to unregister
	**/
	function unregister(dialog) {
		dialogs = dialogs.without(dialog);
		if (dialog.isModal()) {
			modals = modals.without(dialog);
			if (modals.size() == 0) {
				releaseScreen();
			} else {
				Dialog.overlay.setStyle({zIndex: modals.last().getFrame().getStyle('zIndex') - 1});
			}
		}
		registry.unset(dialog.getFrame().identify());
	}
	
	/**
	 *  Dialog.close(id) -> undefined
	 *  - id (String): id of the dialog to close
	**/
	function close(id) {
		registry.get(id).close();
	}
	
	/**
	 *  Dialog.closeAll() -> undefined
	 *  
	 *  Closes all open windows, modal or otherwise
	**/
	function closeAll() {
		dialogs.invoke('close');
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
			console[kind]('proto-dialogs: ' + message);
		}
	}
	
	Object.extend(Dialog, {
		init: init,
		effectsQueue: effectsQueue,
		register: register,
		unregister: unregister,
		close: close,
		closeAll: closeAll,
		log: log.curry('log'),
		info: log.curry('info'),
		warn: log.curry('warn'),
		error: log.curry('error')
	});
})();

if (document.loaded) {
	Dialog.init();
} else {
	document.observe('dom:loaded', Dialog.init);
}

//= require "dialog/base"
//= require "dialog/native"
//= require "dialog/ajax"