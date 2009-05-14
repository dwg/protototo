Dialog.Options.Buttons = Object.extend({
	template: new Template('<a href="#" class="#{className}">#{text}</a>')
}, window.DialogOptions && window.DialogOptions.Buttons || {});

/** section: Dialog
 *  class Dialog.Buttons
 *  
 *  An abstract class that provides a button panel.
**/
Dialog.Buttons = Class.create(Dialog.Base, {
	defaultOptions: Object.extendAll({}, Dialog.Base.prototype.defaultOptions, {
		buttons: [], // array of {text: String, className: String, onclick: Function, close: Boolean}
		template: Dialog.Options.Buttons.template
	}),
	
	setContents: function($super) {
		this.adaptButtonOptions();
		$super();
		this.addButtons();
		this.observeClosing();
	},
	
	/**
	 *  Dialog.Buttons#adaptButtonOptions() -> undefined
	 *  
	 *  Converts overridable button options to a button array.
	 *  If the options `buttonOrder` was given, it is used to
	 *  determine the order in which the buttons will be added,
	 *  otherwise no order is guaranteed.
	**/
	adaptButtonOptions: function() {
		if (this.options.buttons.size() == 0) {
			var buttons = this.options.buttonOrder || $H(this.options).keys().grep(/Text$/);
			this.options.buttons = buttons.inject([], function(acc, k) {
				var key = k.sub(/Text$/, '')
				var ukey = key.capitalize();
				acc.push({
					text: this.options[key + 'Text'],
					className: this.options[key + 'Class'],
					onclick: this.options['on' + ukey],
					close: this.options['closeOn' + ukey]
				});
				return acc;
			}, this);
		}
	},
	
	/**
	 *  Dialog.Buttons#addButtons() -> undefined
	 *  
	 *  Creates the button panel if there are any buttons,
	 *  generates the buttons from the template and adds them
	 *  to the panel.
	**/
	addButtons: function() {
		if (this.options.buttons.size() == 0) return;
		this.buttons = new Element('div', {className: 'dialog-buttons'});
		this.options.buttons.each(function(button) {
			this.buttons.insert(this.options.template.evaluate(button));
			button.element = this.buttons.childElements().last();
			if (button.close) {
				button.onclick = button.onclick.wrap(function(proceed, event) {
					proceed(event);
					this.close();
				}).bindAsEventListener(this);
			}
			button.element.observe('click', button.onclick);
  		}.bind(this));
		this.dialog.appendChild(this.buttons);
	},
	
	observeClosing: function() {
		this.closeHook = function(event) {
			var dialog = event.memo.dialog;
			if (dialog !== this) return;
			this.options.buttons.each(function(button) {
				button.element.stopObserving('click', button.onclick);
			});
			(this.opener || document).stopObserving('dialog:closing', this.closeHook);
		}.bindAsEventListener(this);
		(this.opener || document).observe('dialog:closing', this.closeHook);
	}
});