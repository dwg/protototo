DialogOptions = Object.extend({
	stylesheetPath: '/stylesheets/dialogs.css',
	ie6StylesheetPath: '/stylesheets/dialogs_ie6.css',
}, window.DialogOptions || {});

Dialog = {
	_stylesheetsIncluded: false,
	
	clearObservers: function() {
		if (!Dialog.resizeObserver) return;
		Event.stopObserving(window, 'resize', Dialog.resizeObserver);
		if (Prototype.Browser.ltIE7) {
			Event.stopObserving(window, 'scroll', Dialog.resizeObserver);
		}
		Dialog.resizeObserver = null;
	},
	
	close: function() {
		this.onCallback('onClose');
		this.clearObservers;
		[Dialog.current.modalCover, Dialog.current.dialog].each(function(e) {e.remove();});
		Dialog.current = null;
	},
	
	onCallback: function(callback) {
		if (Dialog.current && Dialog.current.options[callback]) Dialog.current.options[callback]();
	},
	
	_includeStylesheets: function() {
		if (Dialog._stylesheetsIncluded) return;
		Stylesheet.include(DialogOptions.stylesheetPath);
		if (Prototype.Browser.ltIE7) Stylesheet.include(DialogOptions.ie6StylesheetPath);
		Dialog._stylesheetsIncluded = true;
	},
	
	closer: function(event) {
		if (event && event.stop) event.stop();
		if (Dialog.current) Dialog.current.close();
	},
	
	emptyEventHandler: function(event) {
		event.stop();
	}
};

Dialog.Base = Class.create({
	defaultOptions: {
		coverOpacity: 0.4,
		coverDuration: 0.15
	},
	
	initialize: function(options) {
		this.options = Object.serialExtend({}, this.defaultOptions, options);
		// TODO: handle dialog from dialog
		this.create();
	},
	
	create: function() {
		this.createElements();
		document.body.appendChild(this.modalCover);
		document.body.appendChild(this.dialogWrapper);
		this.afterCreate();
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
		this.dialogContents = new Element('div', {id: 'dialog_contents'});
		this.dialog.appendChild(this.dialogContents);
		this.dialogWrapper = new Element('div', {id: 'dialog_wrapper'});
		this.dialogWrapper.appendChild(this.dialog);
		this.setContents();
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
			this.modalCover.setStyle({top: verticalScroll + 'px'});
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
		this.dialog.fade({duration: 0.2, afterFinish: function() { Dialog.close(); }});
	}
});

document.observe('dom:loaded', Dialog._includeStylesheets);