Dialog.Confirm = Class.create(Dialog.Alert, {
	defaultOptions: Object.serialExtend({}, Dialog.Alert.prototype.defaultOptions, {
		okayText: 'Yes',
		cancelText: 'No',
		onCancel: Dialog.closer,
		contents: 'This is a confirmation dialog'
	})
});
