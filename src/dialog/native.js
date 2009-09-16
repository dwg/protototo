Object.extend(Dialog, {
	alert: function(message) {
		new Dialog.Base({content: message, modal: true});
	},
	
	confirm: function(question, handler) {
		new Dialog.Base({
			content: question, modal: true,
			buttons: [
				{text: 'Yes', close: true, onclick: function(event) {event.stop(); handler(true);}},
				{text: 'No', close: true, onclick: function(event) {event.stop(); handler(false);}}
			]
		});
	},
	
	prompt: function(question, handler) {
		var input = new Element('input', {type: 'text'});
		new Dialog.Base({
			content: [new Element('p').update(question), input],
			modal: true,
			buttons: [
				{text: 'Ok', close: true, onclick: function(event) {event.stop(); handler(input.getValue());}},
				{text: 'Cancel', close: true, onclick: function(event) {event.stop(); handler(null);}}
			]
		});
	}
});
