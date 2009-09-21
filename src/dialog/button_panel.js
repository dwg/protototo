Dialog.Options.Buttons = Object.extend({
	template: new Template('<a href="#" class="#{className}">#{text}</a>')
}, window.DialogOptions && window.DialogOptions.Buttons || {});

/** section: Dialog
 *  class Dialog.ButtonPanel
 *  
 *  A class that provides a button panel for dialogs.
**/
Dialog.ButtonPanel = (function() {
	function buildButton(template, options) {
		return new Element('div').update(template.evaluate(options)).down();
	}
	
	return Class.create({
		/**
		 *  new Dialog.ButtonPanel(owner[, options = {}[, buttons...])
		 *  - owner (Dialog.Interface): the dialog containing the panel.
		 *  - options (Object): options to initialize the panel with.
		 *  - buttons (Object): options for each button to insert into panel.
		**/
		initialize: function(owner) {
			this.owner = owner;
			var args = $A(arguments).slice(1);
			var options = args.first() && args.first().onclick ? {} : args.shift();
			this.options = Object.extend({
				template: Dialog.Options.Buttons.template
			}, options || {});
			this.createPanel();
			args.each(this.addButton, this);
		},
		
		createPanel: function() {
			this.element = new Element('div', {className: 'dialog-buttons'});
		},
		/**
		 *  Dialog.ButtonPanel#addButton(buttonOptions) -> Element
		 *  - buttonOptions (Object): must contain an `onclick` attribute along with
		 *    whatever attributes needed for the template.
		**/
		addButton: function(buttonOptions) {
			buttonOptions = Object.extend({className: 'dialog-button'}, buttonOptions);
			var button = buildButton(this.options.template, buttonOptions);
			this.element.insert(button);
			if (buttonOptions.close) {
				buttonOptions.onclick = buttonOptions.onclick.wrap(function(proceed, event) {
					proceed(event);
					this.owner.close();
				}).bindAsEventListener(this);
			}
			return button.observe('click', buttonOptions.onclick);
		}
	});
})();
