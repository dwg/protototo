Dialog.Buttons = Class.create(Dialog.Base, {
	defaultOptions: Object.extend({}, Dialog.Base.prototype.defaultOptions),
	
	setContents: function($super) {
		$super();
		this.addButtons();
	},
	
	addButtons: function() {
		var buttonOptions = $H(this.options).keys().grep(/Text$/).inject({}, function(acc, k) {
			acc[this.options[k]] = this.options['on' + k.gsub(/Text/, '').capitalize()];
			return acc;
		}, this);
		
		var wrapper = new Element('p', {id: 'dialog_buttons'});
		$H(buttonOptions).each(function(pair) {
			var a = new Element('a', {href: '#'});
			a.appendChild(document.createTextNode(pair.key));
			Event.observe(a, 'click', pair.value);
			wrapper.appendChild(a);
		});
		wrapper.appendChild(new Element('br', {className: 'clear'}));
		this.addElement(wrapper);
	}
});