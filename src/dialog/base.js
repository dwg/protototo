//= require "interface"
//= require "button_panel"

/** section: Dialog
 *  class Dialog.Base
 *  
 *  An abstract base class for all dialogs.
**/
Dialog.Base = (function() {
	return Class.create(Dialog.Interface, {
		defaultOptions: {
			width: 400,
			modal: false,
			transitionDuration: 0.4,
			buttons: [{text: 'Close', close: true, onclick: Event.stopper}]
		},
		
		/**
		 *  new Dialog.Base(options[, opener])
		 *  - options (Object): options for this dialog
		 *  - opener (Element): the element triggering this dialog
		**/
		initialize: function(options_or_opener) {
			var options = Object.isElement(options_or_opener) ? arguments[1] || {} : options_or_opener;
			this.opener = Object.isElement(options_or_opener) ? options_or_opener : arguments[1];
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
			if (Dialog.effects) {
				this.dialog.appear({
					duration: this.options.transitionDuration, queue: Dialog.effectsQueue('with-last')
				});
			} else {
				this.dialog.show();
			}
		},
		
		/**
		 *  Dialog.Base#hide([callback]) -> undefined
		 *  
		 *  Hides this dialog and calls `callback` if present
		**/
		hide: function() {
			if (!this.dialog.visible()) return;
			var callback = arguments[0] || Prototype.emptyFunction;
			if (Dialog.effects) {
				this.dialog.fade({
					duration: this.options.transitionDuration, queue: Dialog.effectsQueue('with-last'),
					afterFinish: callback
				});
			} else {
				this.dialog.hide();
				callback();
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
			this.hide(function() {
				this.dialog.remove();
				Dialog.unregister(this);
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
}());
