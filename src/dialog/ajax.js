/** section: Dialog
 *  class Dialog.Ajax
 *  
 *  A base class for dialogs supporting ajax content.
**/
Dialog.Ajax = Class.create(Dialog.Base, {
	defaultOptions: Object.extendAll({}, Dialog.Base.prototype.defaultOptions, {
		width: 150,
		targetWidth: 400,
		content: '<p style="text-align:center"><img src="' + Dialog.Options.assetPrefix + Dialog.Options.busyImage + '" width="124" height="124" alt="Loading, please wait&#8230;" /></p>',
		ajax: {method: 'get'}
	}),
	
	initialize: function($super, path, options) {
		this.path = path;
		$super(options);
	},
	
	createElements: function($super) {
		$super();
		this.buttonPanel.element.hide();
		new Ajax.Request(this.path, Object.extend(this.options.ajax || {}, {
			onSuccess: this.updateContents.bind(this)
		}));
	},
	
	updateContents: function(transport) {
		this.dialog.setDimensions();
		var wrapper = new Element('div').update(transport.responseText);
		this.contents.update();
		this.contents.insert(wrapper);
		
		if (Dialog.effects) {
			this.contents.hide();
			this.dialog.fade({
				duration: this.options.transitionDuration, queue: Dialog.effectsQueue(),
				afterFinish: function() {
					this.contents.show();
					this.buttonPanel.element.show();
					this.dialog.setStyle({width: this.options.targetWidth.px(), height: 'auto'});
					this.layout();
				}.bind(this)
			});
			this.dialog.appear({duration: this.options.transitionDuration, queue: Dialog.effectsQueue()});
		} else {
			this.buttonPanel.element.show();
			this.dialog.setStyle({width: this.options.targetWidth.px(), height: 'auto'});
			this.layout();
		}
	}
});
