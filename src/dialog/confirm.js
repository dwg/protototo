/** section: Dialog
 *  class Dialog.Confirm
 *  
 *  Simulates a standard `confirm`ation dialog.
**/
Dialog.Confirm = Class.create(Dialog.Alert, {
	defaultOptions: Object.extendAll({}, Dialog.Alert.prototype.defaultOptions, {
		okayText: 'Yes',
		cancelText: 'No',
		onCancel: Event.stopper,
		closeOnCancel: true,
		content: 'Confirmation with no content'
	})
});

/**
 *  Dialog.confirm(question, handler[, opener]) -> Dialog.Confirm
 *  - question (String | Element): the content to show in the confirm
 *  - handler (Function): function to invoke when dialog closed. This function
 *  will receive a `Boolean` indicating a positive or negative result
 *  - opener (Element): the element triggering this confirm
 *  
 *  Shows a modal confirmation dialog with the given content.
**/
Dialog.confirm = function(question, handler) {
	return new Dialog.Confirm({
		content: question,
		onOkay: function(event) {
			event.stop();
			handler(true);
		},
		onCancel: function(event) {
			event.stop();
			handler(false);
		}
	}, arguments[2]);
};
