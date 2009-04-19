Dialog.Alert = Class.create(Dialog.Buttons, {
	defaultOptions: Object.serialExtend({}, Dialog.Base.prototype.defaultOptions, {
		okayText: 'Close',
		contents: 'This is an alert dialog',
		onOkay: Dialog.emptyEventHandler,
		closeOnOkay: true
	}),
	
	_wrapInCloser: function(fn) {
		return function(event) {
			event.stop();
			Dialog.current.close();
			fn(event);
		}
	},
	
	setContents: function($super) {
		if (this.options.closeOnOkay) {
			this.options.onOkay = this._wrapInCloser(this.options.onOkay);
		}
		[this.options.contents].flatten().each(function(c) {
			if (Object.isElement(c)) {
				this.addElement(c);
			} else if (Object.isString(c)) {
				if (/(<[^>]+>.*<\/[^>]+>)|(<[^\/]+\/>)/.test(c)) {
					var root = document.createElement('div');
					root.innerHTML = c;
					this.addElement(root.childNodes[0]);
				} else {
					this.addElement(document.createTextNode(c));
				}
			}
		}, this);
		$super();
	}
});

//var old_alert = alert;
//var alert = function(message) {
//	new Dialog.Alert({closeText: 'OK', contents: message});
//};