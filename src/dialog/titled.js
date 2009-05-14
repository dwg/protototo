/** section: Dialog
 *  class Dialog.Titled
**/
Dialog.Titled = (function() {
	var undef;
	
	function box(number, above, below) {
		return [below, [above, number].max()].min();
	}
	
	function mouseMove(event) {
		var dims = this.dialog.getDimensions();
		var pageDims = document.viewport.getDimensions();
		var left = box(event.pointerX() + this._dragOffset.left, 0, pageDims.width - dims.width);
		var top = box(event.pointerY() + this._dragOffset.top, 0, pageDims.height - dims.height);
		this.dialog.setStyle({
			left: left.px(),
			top: top.px()
		});
		event.stop();
	}
	
	function mouseDown(event) {
		this._dragOffset = {
			left: parseFloat(this.dialog.getStyle('left')) - event.pointerX(),
			top: parseFloat(this.dialog.getStyle('top')) - event.pointerY()
		};
		document.observe('mousemove', this._mouseMove);
		document.observe('mouseup', this._mouseUp);
		var body = $$('body').first();
		event.stop();
	}
	
	function mouseUp(event) {
		this._dragOffset = null;
		document.stopObserving('mousemove', this._mouseMove);
		document.stopObserving('mouseup', this._mouseUp);
		event.stop();
	}
	
	function observeTitle(dialog) {
		dialog._mouseDown = mouseDown.bindAsEventListener(dialog);
		dialog._mouseMove = mouseMove.bindAsEventListener(dialog);
		dialog._mouseUp = mouseUp.bindAsEventListener(dialog);
		dialog.title.observe('mousedown', dialog._mouseDown);
	}
	
	return Class.create(Dialog.Base, {
		defaultOptions: Object.extendAll({}, Dialog.Base.prototype.defaultOptions, {
			title: '&nbsp;'
		}),
		
		createElements: function($super) {
			$super();
			this.title = new Element('div', {className: 'dialog-title'});
			this.dialog.insert({top: this.title});
			this.setTitle(this.options.title);
			if (this.options.draggable) observeTitle(this);
		},
		
		/**
		 *  Dialog.Titled#setTitle(title) -> undefined
		 *  - title (String): the title to set
		 *  
		 *  Sets the dialogs title.
		**/
		setTitle: function(title) {
			this.title.update(title);
		},
		
		close: function($super) {
			if (this.options.draggable) {
				this.title.stopObserving('mousedown', this._mouseDown);
			}
			$super();
		}
	});
})();
