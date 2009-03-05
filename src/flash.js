DialogOptions.Flash = Object.extend({
	informationImage: '/images/info.png',
	warningImage: '/images/warning.png',
	errorImage: '/images/error.png',
	duration: 3 //seconds
}, window.DialogOptions && window.DialogOptions.Flash || {});

Dialog.Flash = Class.create(Dialog.Alert, {
	defaultOptions: Object.serialExtend({}, Dialog.Alert.prototype.defaultOptions, {
		flashType: 'information',
		dialogClass: 'flash'
	}),
	
	setOptions: function($super, options) {
		$super(options);
		var validTypes = $w('information warning error');
		if (!validTypes.include(this.options.flashType)) {
			throw this.options.flashType + ' is not a valid flash dialog type (' + validTypes.join(', ') + ')';
		}
	},
	
	setContents: function($super) {
		this.flashContents = new Element('div', {id: 'flash_contents'});
		var typeImage = new Element('img', {
			src: DialogOptions.Flash[this.options.flashType + 'Image'],
			alt: this.options.flashType
		});
		this.dialogContents.appendChild(typeImage);
		this.dialogContents.appendChild(this.flashContents);
		$super();
	},
	
	addElement: function() {
		$A(arguments).each(function(e) {
			this.flashContents.appendChild(e);
		}, this);
	}
});

Dialog.flash = function(messageType, message) {
	var d = new Dialog.Flash({flashType: messageType, contents: message});
	d.close.bind(d).delay(DialogOptions.Flash.duration);
};
Dialog.information = Dialog.flash.curry('information');
Dialog.warning = Dialog.flash.curry('warning');
Dialog.error = Dialog.flash.curry('error');