/** section: Dialog
 *  class Dialog.Alert
 *  
 *  Simulates a standard `alert` dialog.
**/
Dialog.Alert = Class.create(Dialog.Buttons, {
	defaultOptions: Object.extendAll({}, Dialog.Buttons.prototype.defaultOptions, {
		okayText: 'Close',
		onOkay: Event.stopper,
		closeOnOkay: true,
		content: 'Alert with no content',
		modal: true
	})
});

/**
 *  Dialog.alert(message[, opener]) -> Dialog.Alert
 *  - message (String | Element): the content to show in the alert
 *  - opener (Element): the element triggering this dialog
 *  
 *  Shows a modal alert dialog with the given content.
**/
Dialog.alert = function(message) {
	return new Dialog.Alert({content: message}, arguments[1]);
};