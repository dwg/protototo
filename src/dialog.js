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
	defaultOptions: {},
	
	initialize: function(options) {
		this.options = Object.serialExtend({}, this.defaultOptions, options);
		// TODO: handle dialog from dialog
		this.create();
	},
	
	create: function() {
		this.createElements();
		document.body.appendChild(this.modalCover);
		document.body.appendChild(this.dialog);
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
		this.modalCover.visualEffect('fade', {from: 0.1, to: 0.4, duration: 0.15});
	},
	
	showDialog: function() {
		Dialog.onCallback('beforeShow');
		this.dialog.visualEffect('appear', {duration: 0.4, afterFinish: function() {
			Dialog.onCallback('afterShow');
		}});
	},
	
	setContents: function() {
		// Override to set dialog contents
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
		this.dialog.setStyle({
			top: dialogTop + 'px',
			left: ((pageDims.width - dialogDims.width)/2) + 'px'
		});
	},
	
	close: function() {
		this.dialog.visualEffect('fade', {duration: 0.2, afterFinish: function() { Dialog.close(); }});
	}
});

document.observe('dom:loaded', Dialog._includeStylesheets);