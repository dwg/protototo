//= require "interface"
//= require "button_panel"

/** section: Dialog
 *  class Dialog.Base
 *  
 *  A base class for all dialogs.
**/
Dialog.Base = Class.create(Dialog.Interface, {
	defaultOptions: {
		width: Dialog.Options.defaultWidth,
		modal: false,
		transitionDuration: Dialog.Options.transitionDuration,
		buttons: [{text: 'Close', close: true, onclick: Event.stopper}]
	},
	
	/**
	 *  new Dialog.Base(options[, opener])
	 *  - options (Object): options for this dialog
	 *  - opener (Element): the element triggering this dialog
	**/
	initialize: function(options) {
		this.options = Object.extendAll({}, this.defaultOptions, options);
		this.create();
		Dialog.register(this);
		this.show();
	},
	
	getFrame: function() {
		return this.dialog;
	},
	
	isModal: function() {
		return this.options.modal;
	},
	
	create: function() {
		this.createElements();
		this.setContents();
		this.layout();
	},
	
	createElements: function() {
		this.dialog = new Element('div', {id: this.options.id || '', className: 'dialog'}).hide().setWidth(this.options.width);
		if (this.options.className) this.dialog.addClassName(this.options.className);
		if (this.options.modal) this.dialog.addClassName('dialog-modal');
		this.contents = new Element('div', {className: 'dialog-content'});
		this.dialog.insert(this.contents);
		this.buttonPanel = new Dialog.ButtonPanel(this);
		this.options.buttons.each(this.buttonPanel.addButton, this.buttonPanel);
		this.dialog.insert(this.buttonPanel.element);
		$(document.body).insert(this.dialog);
	},
	
	/**
	 *  Dialog.Base#layout() -> undefined
	 *  
	 *  Centers this dialog on the current viewport
	**/
	layout: function() {
		this.dialog.centerInViewport({minLeft: 10, minTop: 10});
	},
	
	/**
	 *  Dialog.Base#show() -> undefined
	 *  
	 *  Shows this dialog
	**/
	show: function() {
		if (this.dialog.visible()) return;
		this.callback('beforeShow');
		if (Dialog.effects) {
			this.dialog.appear({
				duration: this.options.transitionDuration, queue: Dialog.effectsQueue('with-last'),
				afterFinish: this.callback.bind(this, 'afterShow')
			});
		} else {
			this.dialog.show();
			this.callback('afterShow');
		}
	},
	
	/**
	 *  Dialog.Base#hide([callback]) -> undefined
	 *  
	 *  Hides this dialog and calls `callback` if present
	**/
	hide: function(callback) {
		if (!this.dialog.visible()) return;
		if (Dialog.effects) {
			this.dialog.fade({
				duration: this.options.transitionDuration, queue: Dialog.effectsQueue('with-last'),
				afterFinish: callback || Prototype.emptyFunction
			});
		} else {
			this.dialog.hide();
			if (callback) callback();
		}
	},
	
	/**
	 *  Dialog.Base#close() -> undefined
	 *  fires dialog:closing
	 *  
	 *  Hides this dialog, removes it from the document
	 *  and unregisters it
	**/
	close: function() {
		if (this.closing) return;
		this.closing = true;
		this.callback('beforeClose');
		this.hide(function() {
			this.dialog.remove();
			Dialog.unregister(this);
			this.callback('afterClose');
		}.bind(this));
	},
	
	/**
	 *  Dialog.Base#setContents() -> undefined
	 *  
	 *  Override this method or pass `content` as an option to
	 *  the constructor to set the contents of the dialog.
	**/
	setContents: function() {
		[this.options.content].flatten().each(function(c) {
			this.contents.insert(c);
		}, this);
	}
});
