DialogOptions.Lightbox = Object.extend({
	loadImage: '/images/loading.gif',
	closeImage: '/images/close.gif',
	nextImage: '/images/next.gif',
	prevImage: '/images/prev.gif',
	dialogClass: 'lightbox'
}, window.DialogOptions && window.DialogOptions.Lightbox || {});

Dialog.Lightbox = Class.create(Dialog.Base, {
	defaultOptions: Object.serialExtend({}, Dialog.Base.prototype.defaultOptions, {
		dialogClass: 'lightbox'
	}),
	
	currentImage: 0,
	images: [],
	
	initialize: function($super, options) {
		$super(options);
		this.preloadImage(this.currentImage);
	},
	
	create: function($super) {
		this.findGroupImages();
		$super();
	},
	
	findGroupImages: function() {
		var current = this.options.start;
		if (current.rel == 'lightbox') {
			this.images.push({src: current.href, caption: current.title});
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
		$super();
		this.modalCover.observe('click', Dialog.closer);
		this.image = new Element('img', {id: 'lightbox_image'}).hide();
		this.dialog.appendChild(this.image);
	},
	
	setContents: function() {
		this.startLoading();
	},
	
	showContents: function() {
		this.image.src = this.images[this.currentImage].src;
		this.image.appear({duration: 0.4, queue: {position: 'end', scope: 'dialog'}});
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
			this.resizeDialog(preloader.width, preloader.height);
			this.showContents();
		}.bind(this);
		preloader.src = this.images[index].src;
	},
	
	resizeDialog: function(newWidth, newHeight) {
		this.stopLoading();
		var currentDims = this.dialog.getDimensions();
		var pageDims = document.viewport.getDimensions();
		if (currentDims.width == newWidth || currentDims.height == newHeight) return;
		var currentLeft = parseFloat(this.dialog.getStyle('left'));
		var currentTop = parseFloat(this.dialog.getStyle('top'));
		
		var newLeft = currentLeft + (currentDims.width - newWidth)/2;
		var newTop = currentTop + (currentDims.height - newHeight)/2;
		this.dialog.morph('left:' + newLeft + 'px;top:' + newTop + 'px;width:' + newWidth + 'px;height:' + newHeight + 'px;', {duration: 0.6, queue: {position: 'front', scope: 'dialog'}});
	},
	
	startLoading: function() {
		if (!this.loadImage) {
			this.loadImage = new Element('img', {src: DialogOptions.Lightbox.loadImage, id: 'lightbox_loading'});
			this.dialog.appendChild(this.loadImage);
		}
		this.loadImage.show();
	},
	
	stopLoading: function() {
		if (this.loadImage) this.loadImage.hide();
	}
});