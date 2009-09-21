/** section: Dialog
 *  Dialog.Native
 * 
 *  Utilities to simulate native browser dialogs.
 *  Mixed into the Dialog namespace for convenience. 
**/
Dialog.Native = {
	/**
	 *  Dialog.Native.alert(message) -> Dialog.Base
	 *  Dialog.alert(message) -> Dialog.Base
	 *  $alert(message) -> Dialog.Base
	 *  - message (String | Element): the message to alert.
	 *  
	 *  Simulates the native `alert` dialog.
	**/
	alert: function(message) {
		return new Dialog.Base({content: message, modal: true});
	},
	
	/**
	 *  Dialog.Native.confirm(question, handler) -> Dialog.Base
	 *  Dialog.confirm(question, handler) -> Dialog.Base
	 *  $confirm(question, handler) -> Dialog.Base
	 *  - question (String | Element): the question to confirm.
	 *  - handler (Function): to handle the answer.
	 *  
	 *  The handler function will receive `true` is the answer is positive,
	 *  and `false` if negative.
	**/
	confirm: function(question, handler) {
		return new Dialog.Base({
			content: question, modal: true,
			buttons: [
				{text: 'Yes', close: true, onclick: function(event) {event.stop(); handler(true);}},
				{text: 'No', close: true, onclick: function(event) {event.stop(); handler(false);}}
			]
		});
	},
	
	/**
	 *  Dialog.Native.prompt(question, handler) -> Dialog.Base
	 *  Dialog.prompt(question, handler) -> Dialog.Base
	 *  $prompt(question, handler) -> Dialog.Base
	 *  - question (String | Element): the question to prompt.
	 *  - handler (Function): to handle the answer.
	 *  
	 *  The handler funtion will receive the answer or `null` if cancelled.
	**/
	prompt: function(question, handler) {
		var input = new Element('input', {type: 'text'});
		return new Dialog.Base({
			content: [new Element('p').update(question), input],
			modal: true,
			buttons: [
				{text: 'Ok', close: true, onclick: function(event) {event.stop(); handler(input.getValue());}},
				{text: 'Cancel', close: true, onclick: function(event) {event.stop(); handler(null);}}
			],
			afterShow: Form.Element.activate.curry(input)
		});
	}
};
Object.extend(Dialog, Dialog.Native);
$alert = Dialog.Native.alert;
$confirm = Dialog.Native.confirm;
$prompt = Dialog.Native.prompt;