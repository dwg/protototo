/** section: Dialog
 *  mixin Dialog.Interface
 *  
 *  The interface all dialogs must implement.
**/
Dialog.Interface = (function() {
	function mustImplement(failureMessage) {
		return function() {
			Dialog.error(message);
			throw message;
		};
	}
	
	return {
		/**
		 *  Dialog.Interface.getFrame() -> Element
		 *  
		 *  Should be implemented to return the dialog's outermost element.
		**/
		getFrame: mustImplement('getFrame() must be implemented to return the outermost dialog frame.'),
		/**
		 *  Dialog.Interface.close() -> undefined
		 *  
		 *  Should be implemented to close and dispose of the dialog.
		**/
		close: mustImplement('close() must be implemented to close the dialog.'),
		/**
		 *  Dialog.Interface.isModal() -> Boolean
		 *  
		 *  Should return true if the dialog is intended to be modal, false otherwise (the default).
		**/
		isModal: function() {
			return false;
		},
		
		callback: function(which) {
			if (this.options[which] && Object.isFunction(this.options[which])) {
				this.options[which]();
			}
		}
	};
})();