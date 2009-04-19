DialogOptions = Object.extend({
	stylesheetPath: '/stylesheets/dialogs.css',
	ieStylesheetPath: '/stylesheets/dialogs_ie.css',
	ie6StylesheetPath: '/stylesheets/dialogs_ie6.css'
}, window.DialogOptions || {});

Dialog = {
	queue: [],
	
	clearObservers: function() {
		if (!Dialog.resizeObserver) return;
		Event.stopObserving(window, 'resize', Dialog.resizeObserver);
		if (Prototype.Browser.ltIE7) {
			Event.stopObserving(window, 'scroll', Dialog.resizeObserver);
		}
		Dialog.resizeObserver = null;
	},
	
	close: function() {
		this.onCallback('onClose');
		this.clearObservers();
		if (Dialog.current) {
			[Dialog.current.modalCover, Dialog.current.dialogWrapper].invoke('remove');
			Dialog.current = null;
		}
		Dialog.closing = false;
	},
	
	onCallback: function(callback) {
		if (Dialog.current && Dialog.current.options[callback]) Dialog.current.options[callback]();
	},
	
	_includeStylesheets: function() {
		if (Dialog._stylesheetsIncluded) return;
		Stylesheet.include(DialogOptions.stylesheetPath);
		if (Prototype.Browser.IE) Stylesheet.include(DialogOptions.ieStylesheetPath);
		if (Prototype.Browser.ltIE7) Stylesheet.include(DialogOptions.ie6StylesheetPath);
		Dialog._stylesheetsIncluded = true;
	},
	
	closer: function(event) {
		if (event && event.stop) event.stop();
		if (Dialog.current) Dialog.current.close();
	},
	
	emptyEventHandler: function(event) {
		event.stop();
	},
	
	push: function() {
		if (!Dialog.current) return;
		Dialog.queue.push(Dialog.current);
		Dialog.current.removeContent();
		Dialog.current = null;
	},
	
	pop: function() {
		if (Dialog.queue.size() == 0) return;
		Dialog.current = Dialog.queue.pop();
		Dialog.current.addContentElement();
		Dialog.current.showContent();
	}
};

document.observe('dom:loaded', Dialog._includeStylesheets);

//= require "dialog/base"
//= require "dialog/buttons"
//= require "dialog/alert"
//= require "dialog/confirm"
//= require "dialog/lightbox"
//= require "dialog/flash"