DialogOptions.Buttons = Object.extend({
	template: new Template('<a href="#" class="#{class}">#{text}</a>')
}, window.DialogOptions && window.DialogOptions.Buttons || {});

Dialog.Buttons = Class.create(Dialog.Base, {
	defaultOptions: Object.extend({}, Dialog.Base.prototype.defaultOptions),
	
	setContents: function($super) {
		$super();
		this.addButtons();
	},
	
	addButtons: function() {
		// TODO: fix button alignment to bottom
		var buttons = $H(this.options).keys().grep(/Text$/).inject([], function(acc, k) {
			var key = k.sub(/Text$/, '')
			var ukey = key.capitalize();
			acc.push({text: this.options[key + 'Text'], 'class': this.options[key + 'Class'], onclick: this.options['on' + ukey]});
			return acc;
		}, this);
		
		var wrapper = new Element('p', {id: 'dialog_buttons'});
		var builder = new Element('div');
		buttons.each(function(button) {
			builder.innerHTML = DialogOptions.Buttons.template.evaluate(button);
			var b = builder.down();
			b.observe('click', button.onclick);
			wrapper.appendChild(b);
		});
		this.addElement(wrapper);
		if (wrapper.childElements().detect(function(e) {return e.getStyle('float') != 'none'})) {
			wrapper.appendChild(new Element('br', {className: 'clear'}));
		}
	}
});