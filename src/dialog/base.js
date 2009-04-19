Dialog.Base = Class.create({
	defaultOptions: {
		coverOpacity: 0.4,
		coverDuration: 0.15
	},

	initialize: function(options) {
		this.setOptions(options);
		if (Dialog.current) {
			if (Dialog.closing) {
				var f = function() {
					if (Dialog.closing) {
						f.delay(0.2);
					} else {
						this.create();
					}
				}.bind(this);
				f();
			} else {
				this.copy();
			}
		} else {
			this.create();
		}
	},

	setOptions: function(options) {
		this.options = Object.serialExtend({}, this.defaultOptions, options);
	},

	create: function() {
		this.createElements();
		document.body.appendChild(this.modalCover);
		document.body.appendChild(this.dialogWrapper);
		this.afterCreate();
	},

	copy: function() {
		var current = Dialog.current;
		Dialog.push();
		// TODO: dialogClass
		$w('modalCover dialog dialogWrapper').each(function(e) { this[e] = current[e]; }, this);
		this.createContentElement();
		this.addContentElement();
		this.setContents();
		this.showContent();
		Dialog.current = this;
	},

	createElements: function() {
		this.modalCover = $(new Element('div', {id: 'modal_cover'}));
		this.dialog = $(new Element('div', {id: 'dialog'}));
		this.dialog.setStyle({display: 'none'});
		if (Prototype.Browser.ltIE7) {
			this.modalCover.appendChild(new Element('iframe'));
		}
		if (this.options.dialogClass) {
			this.dialog.addClassName(this.options.dialogClass);
		}
		this.createContentElement();
		this.dialogWrapper = new Element('div', {id: 'dialog_wrapper'});
		this.dialogWrapper.appendChild(this.dialog);
		this.setContents();
	},

	createContentElement: function() {
		this.dialogContents = new Element('div', {id: 'dialog_contents'});
		this.addContentElement();
	},

	addContentElement: function() {
		this.dialog.appendChild(this.dialogContents);
	},

	afterCreate: function() {
		this.layout();

		this.observeWindow();

		Dialog.current = this;

		this.showCover();
		this.showDialog();
	},

	observeWindow: function() {
		Dialog.resizeObserver = this.layout.bind(this);
		Event.observe(window, 'resize', Dialog.resizeObserver);
		if (Prototype.Browser.ltIE7) {
			Event.observe(window, 'scroll', Dialog.resizeObserver);
		}
	},

	showCover: function() {
		this.modalCover.visualEffect('fade', {
			from: 0.1, to: this.options.coverOpacity,
			duration: this.options.coverDuration,
			queue: {position: 'end', scope: 'dialog'
		}});
	},

	showDialog: function() {
		Dialog.onCallback('beforeShow');
		this.dialog.visualEffect('appear', {duration: 0.4, queue: {position: 'end', scope: 'dialog'}, afterFinish: function() {
			Dialog.onCallback('afterShow');
		}});
	},

	resizeDialog: function(newWidth, newHeight) {
		var currentDims = this.dialog.getDimensions();
		currentDims.width = currentDims.width - 20; // hacky
		currentDims.height = currentDims.height - 20;
		if (currentDims.width == newWidth && currentDims.height == newHeight) return;
		var currentTop = parseFloat(this.dialogWrapper.getStyle('top'));

		var newTop = currentTop + (currentDims.height - newHeight)/2;
		this.dialogWrapper.morph('top:' + newTop + 'px;', {queue: 'front', duration: 0.6});
		this.dialog.morph('width:' + newWidth + 'px;height:' + newHeight + 'px;', {duration: 0.6, queue: {position: 'end', scope: 'dialog'}});
	},

	setContents: function() {
		// Override to set dialog contents
	},

	addElement: function() {
		$A(arguments).each(function(e) {
			this.dialogContents.appendChild(e);
		}, this);
	},

	layout: function() {
		var pageDims = document.viewport.getDimensions();
		var dialogDims = this.dialog.getDimensions();

		var dialogTop = (pageDims.height - dialogDims.height)/2;
		if (Prototype.Browser.ltIE7) {
			var verticalScroll = document.viewport.getScrollOffsets().top;
			dialogTop += verticalScroll;
			this.modalCover.setStyle({top: verticalScroll + 'px', height: pageDims.height + 'px', width: pageDims.width + 'px'});
		}
		if (this.dialog.visible()) {
			var currentTop = parseFloat(this.dialogWrapper.getStyle('top') || 0);
			var speed = 200; // px per second
			this.dialogWrapper.morph('top:' + dialogTop + 'px;', {
				queue: {position: 'end', scope: 'dialog'},
				duration: Math.abs(dialogTop - currentTop)/speed
			});
		} else {
			this.dialogWrapper.setStyle({
				top: dialogTop + 'px'
			});
		}
	},

	close: function() {
		if (Dialog.queue.size() == 0) {
			Dialog.closing = true;
			this.dialog.fade({duration: 0.4, afterFinish: function() { Dialog.close(); }});
		} else {
			this.removeContent();
			Dialog.pop();
		}
	},

	removeContent: function() {
		this.dialogContents.fade({
			duration: 0.2, queue: {position: 'end', scope: 'dialog'},
			afterFinish: function() {
				this.dialogContents.remove();
			}.bind(this)});
	},

	showContent: function(options) {
		// TODO: preserve style width
		var dims = this.dialogContents.getDimensions();
		this.resizeDialog(dims.width, dims.height);
		// TODO: beforeShow
		this.dialogContents.appear({duration: 0.4, queue: {position: 'end', scope: 'dialog'}});
		// TODO: afterShow
	}
});