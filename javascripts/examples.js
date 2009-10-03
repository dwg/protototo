// Playground
Dialog.Message = (function() {
	var titles = {info: 'Information', warning: 'Warning', error: 'Error'};
	
	function message(kind, content) {
		var closer,
			dialog = new Dialog.Base({
			content: [
				'<img src="./images/' + kind + '.png" alt="" style="float: left; margin: 0 10px 10px 0;" />',
				'<h3>' + titles[kind] + '</h3>',
				content
			],
			modal: true,
			buttons: [{text: 'Ok', close: true, onclick: Event.stopper}],
			className: 'dialog-message',
			beforeClose: function() {
				$('dialog-overlay').stopObserving('click', closer);
			}
		});
		closer = dialog.close.bind(dialog);
		$('dialog-overlay').observe('click', closer);
	}
	
	function observeOverlay(dialog) {
		dialog.close();
	}
	
	return {
		info: message.curry('info'),
		warning: message.curry('warning'),
		error: message.curry('error')
	};
})();

document.observe('dom:loaded', function() {
	$('alert').observe('click', function(event) {
		event.stop();
		$alert('Alert !');
	});
	$('confirm').observe('click', function(event) {
		event.stop();
		$confirm('Are you sure?', function(yes) {
			if (yes) {
				Dialog.alert('yay!!!');
			} else {
				Dialog.alert('boo!!!');
			}
		});
	});
	$('prompt').observe('click', function(event) {
		event.stop();
		$prompt('What is your name?', function(answer) {
			if (answer) {
				Dialog.alert('Hi, ' + answer + '!');
			} else {
				Dialog.alert('How rude!');
			}
		});
	});
	$('custom').observe('click', function(event) {
		event.stop();
		new Dialog.Base({
			content: '<form action="/login" method="post"><p><label for="login">Login</label><br/><input type="text" name="login" id="login"/></p><p><label for="password">Password</label><br/><input type="password" name="password" id="password"/></p></form>',
			buttons: [
				{text: 'Login', close: false, onclick: function(event) {
					event.stop();
					event.element().up('.dialog').down('form').submit();
				}},
				{text: 'Cancel', close: true, onclick: Event.stopper}
			],
			afterShow: function() {
				Dialog.current().contents.down('input').activate();
			}
		});
	});
	$('complex').observe('click', function(event) {
		event.stop();
		var b1 = new Element('a', {href: '#'}).update('Open confirm'),
			b2 = new Element('a', {href: '#'}).update('Open dialog');
		b1.observe('click', function(event) {
			event.stop();
			$confirm('Close all dialogs?', function(yes) {
				if (yes) {
					Dialog.closeAll();
				}
			});
		});
		b2.observe('click', function(event) {
			event.stop();
			new Dialog.Base({content: b1});
		});
		$alert(b2);
	});
	$('info').observe('click', function(event) {
		event.stop();
		Dialog.Message.info('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque fringilla mauris ut tincidunt. Quisque consectetur nunc sit amet orci scelerisque ut lobortis mauris lacinia. Phasellus porta, tellus in suscipit congue, odio erat mollis libero, sed gravida magna purus id purus.</p>');
	});
	$('warn').observe('click', function(event) {
		event.stop();
		Dialog.Message.warning('This is a warning message!');
	});
	$('error').observe('click', function(event) {
		event.stop();
		Dialog.Message.error('This is an error message!');
	});
});
