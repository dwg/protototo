/** section: Dialog
 *  class Dialog.Base
 *  
 *  An abstract base class for all dialogs.
**/
Dialog.Base = (function() {
	function register(dialog) {
		if (dialog.options.modal) {
			Dialog.registerModalDialog(dialog);
		} else {
			Dialog.registerDialog(dialog);
		}	
	}
	
	function unregister(dialog) {
		if (dialog.options.modal) {
			Dialog.unregisterModalDialog(dialog);
		} else {
			Dialog.unregisterDialog(dialog);
		}
	}
	
	return Class.create({
		defaultOptions: {
			width: 400
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
			register(this);
			this.show();
		},
		
		create: function() {
			this.createElements();
			this.setContents();
			this.layout();
		},
		
		createElements: function() {
			this.dialog = new Element('div', {id: this.options.id || '', className: 'dialog'}).hide().setStyle({width: this.options.width.px()});
			this.dialog.identify();
			if (this.options.className) this.dialog.addClassName(this.options.className);
			this.contents = new Element('div', {className: 'dialog-content'});
			this.dialog.appendChild(this.contents);
			$$('body').first().insert(this.dialog);
		},
		
		/**
		 *  Dialog.Base#layout() -> undefined
		 *  
		 *  Centers this dialog on the current viewport
		**/
		layout: function() {
			var pageDims = document.viewport.getDimensions();
			var dialogDims = this.dialog.getDimensions();
			var vertScroll = document.viewport.getScrollOffsets().top;
			
			var top = (pageDims.height - dialogDims.height)/2;
			var left = (pageDims.width - dialogDims.width)/2;
			this.dialog.setStyle({
				top: top.px(), left: left.px()
			});
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
					duration: 0.4, queue: Dialog.defaultQueue()
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
					duration: 0.4, queue: Dialog.defaultQueue(),
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
			Dialog.notify(this, 'closing');
			this.hide(function() {
				this.dialog.remove();
			}.bind(this));
			unregister(this);
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