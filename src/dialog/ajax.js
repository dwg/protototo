Dialog.Options.Ajax = Object.extend({
	loader: '/images/dialogs/loading.gif',
	failureMessage: 'Failed to load content'
}, window.DialogOptions && window.DialogOptions.Ajax || {});

/** section Dialog
 *  class Dialog.Ajax
**/
Dialog.Ajax = (function() {
	function verticalMargin(element) {
		return parseFloat(element.getStyle('marginTop')) + parseFloat(element.getStyle('marginBottom'));
	}
	
	function horizontalMargin(element) {
		return parseFloat(element.getStyle('marginRight')) + parseFloat(element.getStyle('marginLeft'));
	}
	
	function outerDimensions(element) {
		element.show();
		var dims = element.getDimensions();
		element.hide();
		dims.height += verticalMargin(element);
		dims.width += horizontalMargin(element);
		return dims;
	}
	
	return Class.create(Dialog.Alert, {
		defaultOptions: Object.extendAll({}, Dialog.Alert.prototype.defaultOptions, {
			path: '#',
			height: 'auto',
			failureMessage: Dialog.Options.Ajax.failureMessage
		}),
		
		create: function($super) {
			$super();
			new Ajax.Request(this.options.path, {
				method: 'get', evalScripts: true,
				onSuccess: this.updateContents.bind(this),
				onFailure: this.updateContents.bind(this).curry({responseText: this.options.failureMessage})
			});
		},
		
		setContents: function($super) {
			$super();
			this.dialog.setStyle({height: '164px', width: '164px'});
			this.buttons.hide();
			var loader = new Element('img', {src: Dialog.Options.assetPrefix + Dialog.Options.Ajax.loader});
			this.contents.update(loader);
		},
		
		updateContents: function(transport) {
			this.dialog.setStyle({height: this.dialog.getHeight().px()});
			this.hideContent(function() {
				this.contents.update(transport.responseText);
				
				var width = this.options.width - horizontalMargin(this.contents);
				var oldWidth = this.contents.getStyle('width');
				this.contents.setStyle({width: width.px()});
				var dims = outerDimensions(this.contents);
				var buttonsHeight = outerDimensions(this.buttons).height
				dims.height += buttonsHeight;
				this.contents.setStyle({width: oldWidth});
				if (Object.isNumber(this.options.height)) {
					if (dims.height > this.options.height) {
						this.contents.setStyle({
							overflow: 'auto',
							height: (this.options.height - verticalMargin(this.contents) - buttonsHeight).px()
						});
					}
					dims.height = this.options.height;
				}
				this.resize(dims);
				this.showContent();
			}.bind(this));
		},
		
		hideContent: function() {
			var afterFinish = arguments[0] || Prototype.emptyFunction;
			if (Dialog.effects) {
				this.contents.fade({duration: 0.2, queue: Dialog.defaultQueue(), afterFinish: afterFinish})
			} else {
				this.contents.hide();
				afterFinish();
			}
		},
		
		showContent: function() {
			if (Dialog.effects) {
				new Effect.Parallel([
					new Effect.Appear(this.contents, {sync: true}),
					new Effect.Appear(this.buttons, {sync: true})
				], {duration: 0.2, queue: Dialog.defaultQueue()});
			} else {
				this.contents.show();
				this.buttons.show();
			}
		},
		
		resize: function(dimensionsOrWidth) {
			var width, height;
			if (Object.isNumber(dimensionsOrWidth)) {
				width = dimensionsOrWidth;
				height = arguments[1];
			} else {
				width = dimensionsOrWidth.width;
				height = dimensionsOrWidth.height;
			}
			
			var dims = this.dialog.getDimensions();
			var offset = this.dialog.positionedOffset();
			var left = offset.left - (width - dims.width)/2;
			var top = offset.top - (height - dims.height)/2;
			var newStyle = {left: left.px(), top: top.px(), width: width.px(), height: height.px()};
			if (Dialog.effects) {
				this.dialog.morph($H(newStyle).invoke('join', ':').join(';'), {duration: 0.4, queue: Dialog.defaultQueue()});
			} else {
				this.dialog.setStyle(newStyle);
			}
		}
	})
})();
