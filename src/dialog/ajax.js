/** section: Dialog
 *  class Dialog.Ajax
 *  
 *  A base class for dialogs supporting ajax content.
**/
Dialog.Ajax = Class.create(Dialog.Base, {
	defaultOptions: Object.extendAll({}, Dialog.Base.prototype.defaultOptions, {
		ajax: {method: 'get'},
		closeOnFailure: true
	}),
	
	initialize: function($super, path, options) {
		this.path = path;
		$super(options);
	},
	
	create: function() {
		var loader = new Image();
		loader.onload = function() {
			this.dialog = new Element('img', {src: loader.src, alt: 'Loading, please wait&#8230;'});
			$(document.body).insert(this.dialog);
			this.layout();
			Dialog.register(this);
			var request = new Ajax.Request(this.path, Object.extend(this.options.ajax || {}, {
				onComplete: function(transport) {
					if (request.success()) {
						var z = this.dialog.getStyle('zIndex');
						this.dialog.remove();
						this.createElements();
						this.dialog.setStyle({zIndex: z});
						this.setContents(transport);
						this.layout();
						this.show();
					} else if (this.options.closeOnFailure) {
						this.close();
					}
				}.bind(this)
			}));
		}.bind(this);
		loader.src = Dialog.Options.assetPrefix + Dialog.Options.busyImage;
	},
	
	setContents: function(transport) {
		this.contents.update(transport.responseText);
	}
});
