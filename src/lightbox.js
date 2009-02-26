DialogOptions.Lightbox = Object.extend({
	loadImage: '/images/loading.gif',
	closeImage: '/images/closelabel.gif',
	nextImage: '/images/nextlabel.gif',
	prevImage: '/images/prevlabel.gif',
	dialogClass: 'lightbox'
}, window.DialogOptions && window.DialogOptions.Lightbox || {});

Dialog.Lightbox = Class.create(Dialog.Base, {
	defaultOptions: Object.serialExtend({}, Dialog.Base.prototype.defaultOptions, {
		dialogClass: 'lightbox',
		coverOpacity: 0.8,
		coverDuration: 0.3
	}),
	
	initialize: function($super, options) {
		$super(options);
		this.preloadImage(this.currentImage);
	},
	
	create: function($super) {
		this.findGroupImages();
		$super();
	},
	
	findGroupImages: function() {
		this.images = [];
		var current = this.options.start;
		if (current.rel == 'lightbox') {
			this.images.push({src: current.href, caption: current.title});
			this.currentImage = 0;
		} else {
			$$(current.tagName + '[href][rel="' + current.rel + '"]').each(function (e, index) {
				this.images.push({src: e.href, caption: e.title});
				if (current === e) {
					this.currentImage = index;
				}
			}, this);
			// TODO: should uniq?
		}
	},
			
	createElements: function($super) {
		this.createNavigation();
		this.createPanel();
		$super();
		this.modalCover.observe('click', Dialog.closer);
		this.dialogWrapper.observe('click', Dialog.closer);
		this.dialog.observe('click', Dialog.emptyEventHandler);
		this.image = new Element('img', {id: 'lightbox_image'}).hide();
		this.addElement(this.image);
		if (this.images.size() > 1) {
			this.addElement(this.prevLink);
			this.addElement(this.nextLink);
		}
		this.addElement(this.panel)
	},
	
	createNavigation: function() {
		if (this.images.size() == 1) return;
		this.prevLink = new Element('a', {id: 'lightbox_prev'}).hide();
		this.prevLink.observe('click', this.showPrev.bind(this));
		this.prevLink.observe('mouseover', function() {
			this.prevLink.setStyle({backgroundImage: 'url(' + DialogOptions.Lightbox.prevImage + ')'});
		}.bind(this));
		this.prevLink.observe('mouseout', function() {
			this.prevLink.setStyle({backgroundImage: 'none'});
		}.bind(this));
		this.nextLink = new Element('a', {id: 'lightbox_next'}).hide();
		this.nextLink.observe('click', this.showNext.bind(this));
		this.nextLink.observe('mouseover', function() {
			this.nextLink.setStyle({backgroundImage: 'url(' + DialogOptions.Lightbox.nextImage + ')'});
		}.bind(this));
		this.nextLink.observe('mouseout', function() {
			this.nextLink.setStyle({backgroundImage: 'none'});
		}.bind(this));
	},
	
	showPrev: function(event) {
		event.stop();
		this.loadContents(this.currentImage - 1);
	},
	
	showNext: function(event) {
		event.stop();
		this.loadContents(this.currentImage + 1);
	},
	
	loadContents: function(index) {
		if (this.images.size() > 1) {
			this.prevLink.hide();
			this.nextLink.hide();
		}
		this.panel.blindUp({duration: 0.4, queue: {position: 'end', scope: 'dialog'}});
		this.image.fade({duration: 0.4, queue: {position: 'end', scope: 'dialog'}, afterFinish: function() {
			this.startLoading();
			this.preloadImage(index);
		}.bind(this)});
	},
	
	createPanel: function() {
		this.panel = new Element('div', {id: 'lightbox_panel'}).hide();
		var closeLink = new Element('a', {id: 'lightbox_close_link'});
		closeLink.observe('click', Dialog.closer);
		closeLink.appendChild(new Element('img', {src: DialogOptions.Lightbox.closeImage}));
		this.panel.appendChild(closeLink);
		var caption = new Element('p', {id: 'lightbox_caption'});
		this.panel.appendChild(caption);
		this.setCaption(caption);
		if (this.images.size() > 1) {
			var numberDisplay = new Element('p', {id: 'lightbox_number_display'});
			this.setNumberDisplay(numberDisplay);
			this.panel.appendChild(numberDisplay);
		}
		this.panel.appendChild(new Element('br', {className: 'clear'}));
	},
	
	setContents: function() {
		this.startLoading();
	},
	
	setCaption: function(caption) {
		caption.update(this.images[this.currentImage].caption);
	},
	
	setNumberDisplay: function(display) {
		if (this.images.size() == 1) return;
		display.update('Image ' + (this.currentImage + 1) + ' of ' + this.images.size());
	},
	
	showContents: function() {
		this.image.src = this.images[this.currentImage].src;
		this.image.appear({duration: 0.4, queue: {position: 'end', scope: 'dialog'}, afterFinish: function() {
			if (this.images.size() > 1) {
				if (this.currentImage > 0) this.prevLink.show();
				if (this.currentImage < this.images.size() - 1) this.nextLink.show();
			}
		}.bind(this)});
		this.setCaption(this.panel.down('p#lightbox_caption'));
		this.setNumberDisplay(this.panel.down('p#lightbox_number_display'));
		this.panel.blindDown({duration: 0.4, queue: {position: 'end', scope: 'dialog'}});
		this.loadNeighbours();
	},
	
	loadNeighbours: function() {
		if (this.images.size() == 1) return;
		if (this.currentImage != 0) {
			new Image().src = this.images[this.currentImage - 1].src;
		}
		if (this.currentImage != this.images.size() - 1) {
			new Image().src = this.images[this.currentImage + 1].src;
		}
	},
	
	preloadImage: function(index) {
		this.currentImage = index;
		var preloader = new Image();
		preloader.onload = function() {
			this.stopLoading();
			this.panel.setStyle({width: preloader.width + 'px'});
			this.resizeDialog(preloader.width, preloader.height);
			this.showContents();
		}.bind(this);
		preloader.src = this.images[index].src;
	},
	
	startLoading: function() {
		if (!this.loadImage) {
			this.loadImage = new Element('img', {src: DialogOptions.Lightbox.loadImage, id: 'lightbox_loading'});
			this.addElement(this.loadImage);
		}
		this.loadImage.show();
	},
	
	stopLoading: function() {
		if (this.loadImage) this.loadImage.hide();
	}
});