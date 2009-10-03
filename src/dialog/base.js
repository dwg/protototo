//= require "interface"
//= require "button_panel"

/** section: Core
 * class Dialog.Base
 * includes Dialog.Interface
 *  
 *  A base class for all dialogs.
**/
Dialog.Base = Class.create(Dialog.Interface, {
	defaultOptions: {
		width: Dialog.Options.defaultWidth,
		modal: false,
		transitionDuration: Dialog.Options.transitionDuration,
		buttons: [{text: 'Close', close: true}]
	},
	
    /**
     *  new Dialog.Base(options)
     *  - options (Object): options for this dialog
     *  
     *  Supported options:
     *  
     *  * `width` (String | Number): the desired width of the dialog.
     *    By default set to [[Dialog.Options.defaultWidth]].
     *  * `modal` (Boolean): true to simulate a modal dialog,
     *    false otherwise (the default).
     *  * `transitionDuration` (Number): if using effects will determine the
     *    duration of each effects transition. By default set to
     *    [[Dialog.Options.transitionDuration]].
     *  * `buttons` (Array): list of button descriptions for the dialog.
     *    See [[Dialog.ButtonPanel#addButton]] for details.
     *    By default a dialog includes one button with the text "Close"
     *    which closes the dialog.
    **/
	initialize: function(options) {
		this.options = Object.extendAll({}, this.defaultOptions, options);
		this.create();
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
		Dialog.register(this);
		this.show();
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
