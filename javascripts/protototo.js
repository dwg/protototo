/*  protototo
 *  JavaScript framework, version 1.0
 *  (c) 2009 Arni Einarsson
 *
 *  protototo is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------*/

var Protototo = {
	Version: '1.0',
	MinimumPrototypeVersion: '1.6.1'
};

(function() {
	var undef;

	function parse(versionString) {
		var v = versionString.replace(/_.*|\./g, '');
		v = parseInt(v + '0'.times(4 - v.length));
		return versionString.indexOf('_') > -1 ? v - 1 : v;
	}

	if(window.Prototype === undef || window.Element === undef || Element.Methods === undef ||
	  parse(Prototype.Version) < parse(Protototo.MinimumPrototypeVersion)) {
		throw('protototo requires the Prototype JavaScript framework version ' + Protototo.MinimumPrototypeVersion + ' or greater');
	}
})();


Object.extend(Object, {
	extendAll: function() {
		var args = $A(arguments), first = args.shift();
		return args.inject(first, function(acc, o) {
			return Object.extend(acc, o);
		});
	}
});

Object.extend(String.prototype, {
	px: function() {
		return this.endsWith('px') ? this : this + 'px';
	}
});

Object.extend(Number.prototype, {
	px: function() {
		return this.toString().px();
	}
});

(function() {
	var ie = navigator.userAgent.match(/MSIE\s(\d)+/);
	if (ie) {
		var version = parseInt(ie[1]);
		Prototype.Browser['IE' + version] = true;
		Prototype.Browser.ltIE7 = version < 7;
	}
})();

Prototype.CSSFeatures = window.Prototype.CSSFeatures || {};
(function() {
	function positionFixedSupported() {
		var isSupported = null;
		if (document.createElement) {
			var el = document.createElement("div");
			if (el && el.style) {
				el.style.width = "1px";
				el.style.height = "1px";
				el.style.position = "fixed";
				el.style.top = "10px";
				var root = document.body;
				if (root && root.appendChild && root.removeChild) {
					root.appendChild(el);
					isSupported = el.offsetTop === 10;
					root.removeChild(el);
				}
				el = null;
			}
		}
		Prototype.CSSFeatures.PositionFixed = isSupported;
	}

	if (document.loaded) {
		positionFixedSupported();
	} else {
		document.observe('dom:loaded', positionFixedSupported);
	}
})();

Object.extend(Event, {
	stopper: function(event) {
		if (event && Object.isFunction(event.stop)) event.stop();
	}
});

Object.extend(Element.Methods, {
	centerInViewport: function(element, options) {
		element = $(element);
		options = Object.extend({minLeft: -Infinity, minTop: -Infinity}, options || {});
		var vpDims = document.viewport.getDimensions(),
			vpOffsets = document.viewport.getScrollOffsets(),
			elDims = element.getDimensions(),
			prevPosition = element.getStyle('position'),
			newPosition = prevPosition === undefined || prevPosition == 'static' ? 'absolute' : prevPosition;
		element.setStyle({
			position: newPosition,
			left: [options.minLeft, (vpDims.width - elDims.width)/2 + vpOffsets.left].max().px(),
			top: [options.minTop, (vpDims.height - elDims.height)/2 + vpOffsets.top].max().px()
		});
		return element;
	},

	fillDocument: function(element) {
		element = $(element);
		var vpDims = document.viewport.getDimensions(),
			docDims = $(document.documentElement).getDimensions();
		element.setStyle({
			width: Math.max(vpDims.width, docDims.width).px(),
			height: Math.max(vpDims.height, docDims.height).px()
		});
		return element;
	},

	getInnerDimensions: function(element) {
		element = $(element);
		var dims = element.getDimensions(),
			width = $w('paddingLeft paddingRight borderLeftWidth borderRightWidth')
			.inject(dims.width, function(memo, style) {
				return memo - parseInt(element.getStyle(style), 10);
			}),
			height = $w('paddingTop paddingBottom borderTopWidth borderBottomWidth')
			.inject(dims.height, function(memo, style) {
				return memo - parseInt(element.getStyle(style), 10);
			});
		return Object.extend([width, height], {width: width, height: height});
	},

	getInnerWidth: function(element) {
		return Element.getInnerDimensions(element).width;
	},

	getInnerHeight: function(element) {
		return Element.getInnerDimensions(element).height;
	},

	setWidth: function(element, width) {
		element = $(element);
		return element.setStyle({
			width: (Object.isUndefined(width) ? element.getInnerWidth() : width).px()
		});
	},

	setHeight: function(element, height) {
		element = $(element);
		return element.setStyle({
			height: (Object.isUndefined(height) ? element.getInnerHeight() : height).px()
		});
	},

	setDimensions: function(element, dimensions) {
		element = $(element);
		var innerDims = element.getInnerDimensions(),
			undef,
			width = Object.isUndefined(dimensions) ? undef : dimensions.width,
			height = Object.isUndefined(dimensions) ? undef : dimensions.height;
		return element.setStyle({
			width: (Object.isUndefined(width) ? innerDims.width : width).px(),
			height: (Object.isUndefined(height) ? innerDims.height : height).px()
		});
	}
});
Element.addMethods();

Stylesheet = (function() {
	function extractNameFromPath(path) {
		var match = /[^\/]+\.css(?=\?|$)/.exec(path);
		if (match) {
			return match.first();
		}
		return null;
	}

	function link(path) {
		if (!linked(path)) {
			document.getElementsByTagName('head')[0].appendChild(linkTo(path));
		}
	}

	function linked(path) {
		return findLink(path) != null;
	}

	function findLink(path) {
		var name = extractNameFromPath(path),
			links = $$('link[href*=' + path + ']').select(function(link) {
				return name == extractNameFromPath(link.href);
			});
		if (links.size() > 1 && console && console.warn) {
			console.warn('Multiple links to stylesheet ' + name + ': ' + links.inspect());
		}
		return links.first() || null;
	}

	function linkTo(path, media) {
		return new Element('link', {
			type: 'text/css', rel: 'stylesheet',
			media: media || 'screen', href: path
		});
	}

	return {
		link: link,
		linked: linked,
		findLink: findLink,
		linkTo: linkTo
	};
})();

var Dialog = {};

Dialog.Options = Object.extend({
	assetPrefix: '/',
	stylesheetPath: 'stylesheets/protototo/dialogs.css',
	busyImage: 'images/protototo/loading.gif',
	overlayOpacity: 0.75,
	transitionDuration: 0.4,
	defaultWidth: 400
}, window.DialogOptions || {});

(function() {
	var undef;

	function prefix(path) {
		return Dialog.Options.assetPrefix + path;
	}

	function linkStylesheets() {
		Stylesheet.link(prefix(Dialog.Options.stylesheetPath));
	}

	function createOverlay() {
		Dialog.overlay = new Element('div', {id: 'dialog-overlay'}).hide().setStyle({
			backgroundColor: '#000', position: 'fixed',
			top: 0, right: 0, bottom: 0, left: 0
		});
		$(document.body).insert(Dialog.overlay);
		if (!Dialog.effects) Dialog.overlay.setOpacity(Dialog.Options.overlayOpacity);
		if (Prototype.Browser.ltIE7) {
			var iframe = new Element('iframe');
			iframe.style.cssText = 'display:none;position:absolute;top:0;left:0;z-index:-1;filter:mask();width:100%;height:100%;';
			Dialog.overlay.appendChild(iframe);
		}
		if (!Prototype.CSSFeatures.PositionFixed) {
			Dialog.overlayObserver = function() {
				Dialog.overlay.fillDocument().centerInViewport();
			};
			Element.observe(window, 'scroll', Dialog.overlayObserver);
			Element.observe(window, 'resize', Dialog.overlayObserver);
		}
	}

	function init() {
		Dialog.effects = window.Effect !== undef;
		linkStylesheets();
		createOverlay();
	}

	function effectsQueue() {
		var position = arguments[0] || 'end';
		return {position: position, scope: 'protototo'};
	}

	var registry = new Hash(),
		dialogs = [],
		modals = [],
		maxZ = 100;

	function current() {
		return dialogs.last();
	}

	function coverScreen() {
		var overlay = Dialog.overlay;
		overlay.setStyle({zIndex: ++maxZ});
		if (overlay.visible()) return;
		$(document.body).fire('screen:covered');
		if (Dialog.effects) {
			overlay.appear({
				from: 0, to: Dialog.Options.overlayOpacity,
				duration: 0.15, queue: effectsQueue()
			});
		} else {
			overlay.show();
		}
	}

	function releaseScreen() {
		var overlay = Dialog.overlay;
		if (!overlay.visible()) return;
		if (Dialog.effects) {
			overlay.fade({duration: 0.15, queue: effectsQueue()});
		} else {
			overlay.hide();
		}
		$(document.body).fire('screen:released');
	}

	function register(dialog) {
		if (dialog.isModal()) {
			modals.push(dialog);
			coverScreen();
		}
		dialog.getFrame().setStyle({zIndex: ++maxZ});
		dialogs.push(dialog);
		registry.set(dialog.getFrame().identify(), dialog);
	}

	function unregister(dialog) {
		dialogs = dialogs.without(dialog);
		if (dialog.isModal()) {
			modals = modals.without(dialog);
			if (modals.size() == 0) {
				releaseScreen();
			} else {
				Dialog.overlay.setStyle({zIndex: modals.last().getFrame().getStyle('zIndex') - 1});
			}
		}
		registry.unset(dialog.getFrame().identify());
	}

	function close(id) {
		registry.get(id).close();
	}

	function closeAll() {
		dialogs.invoke('close');
	}

	function log(kind, message) {
		if (console && console[kind]) {
			console[kind]('protototo: ' + message);
		}
	}

	Object.extend(Dialog, {
		init: init,
		effectsQueue: effectsQueue,
		current: current,
		register: register,
		unregister: unregister,
		close: close,
		closeAll: closeAll,
		log: log.curry('log'),
		info: log.curry('info'),
		warn: log.curry('warn'),
		error: log.curry('error')
	});
})();

if (document.loaded) {
	Dialog.init();
} else {
	document.observe('dom:loaded', Dialog.init);
}

Dialog.Interface = (function() {
	function mustImplement(failureMessage) {
		return function() {
			Dialog.error(message);
			throw message;
		};
	}

	return {
		getFrame: mustImplement('getFrame() must be implemented to return the outermost dialog frame.'),
		close: mustImplement('close() must be implemented to close the dialog.'),
		isModal: function() {
			return false;
		},

		callback: function(which) {
			if (this.options[which] && Object.isFunction(this.options[which])) {
				return this.options[which]();
			}
		}
	};
})();
Dialog.Options.Buttons = Object.extend({
	template: new Template('<a href="#" class="#{className}">#{text}</a>')
}, window.DialogOptions && window.DialogOptions.Buttons || {});

Dialog.ButtonPanel = (function() {
	function buildButton(template, options) {
		return new Element('div').update(template.evaluate(options)).down();
	}

	return Class.create({
		initialize: function(owner) {
			this.owner = owner;
			var args = $A(arguments).slice(1);
			var options = args.first() && args.first().onclick ? {} : args.shift();
			this.options = Object.extend({
				template: Dialog.Options.Buttons.template
			}, options || {});
			this.createPanel();
			args.each(this.addButton, this);
		},

		createPanel: function() {
			this.element = new Element('div', {className: 'dialog-buttons'});
		},
		addButton: function(buttonOptions) {
			buttonOptions = Object.extend({className: 'dialog-button', onclick: Event.stopper}, buttonOptions);
			var button = buildButton(this.options.template, buttonOptions);
			this.element.insert(button);
			if (buttonOptions.close) {
				buttonOptions.onclick = buttonOptions.onclick.wrap(function(proceed, event) {
					proceed(event);
					this.owner.close();
				}).bindAsEventListener(this);
			}
			return button.observe('click', buttonOptions.onclick);
		}
	});
})();

Dialog.Base = Class.create(Dialog.Interface, {
	defaultOptions: {
		width: Dialog.Options.defaultWidth,
		modal: false,
		transitionDuration: Dialog.Options.transitionDuration,
		buttons: [{text: 'Close', close: true}]
	},

	initialize: function(options) {
		this.options = Object.extendAll({}, this.defaultOptions, options);
		this.create();
	},

	getFrame: function() {
		return this.dialog;
	},

	isModal: function() {
		return this.options.modal;
	},

	create: function() {
		this.createElements();
		this.setContents();
		this.layout();
		Dialog.register(this);
		this.show();
	},

	createElements: function() {
		this.dialog = new Element('div', {id: this.options.id || '', className: 'dialog'}).hide().setWidth(this.options.width);
		if (this.options.className) this.dialog.addClassName(this.options.className);
		if (this.options.modal) this.dialog.addClassName('dialog-modal');
		this.contents = new Element('div', {className: 'dialog-content'});
		this.dialog.insert(this.contents);
		this.buttonPanel = new Dialog.ButtonPanel(this);
		this.options.buttons.each(this.buttonPanel.addButton, this.buttonPanel);
		this.dialog.insert(this.buttonPanel.element);
		$(document.body).insert(this.dialog);
	},

	layout: function() {
		this.dialog.centerInViewport({minLeft: 10, minTop: 10});
	},

	show: function() {
		if (this.dialog.visible()) return;
		this.callback('beforeShow');
		if (Dialog.effects) {
			this.dialog.appear({
				duration: this.options.transitionDuration, queue: Dialog.effectsQueue('with-last'),
				afterFinish: this.callback.bind(this, 'afterShow')
			});
		} else {
			this.dialog.show();
			this.callback('afterShow');
		}
	},

	hide: function(callback) {
		if (!this.dialog.visible()) return;
		if (Dialog.effects) {
			this.dialog.fade({
				duration: this.options.transitionDuration, queue: Dialog.effectsQueue('with-last'),
				afterFinish: callback || Prototype.emptyFunction
			});
		} else {
			this.dialog.hide();
			if (callback) callback();
		}
	},

	close: function() {
		if (this.closing) return;
		this.closing = true;
		this.callback('beforeClose');
		this.hide(function() {
			this.dialog.remove();
			Dialog.unregister(this);
			this.callback('afterClose');
		}.bind(this));
	},

	setContents: function() {
		[this.options.content].flatten().each(function(c) {
			this.contents.insert(c);
		}, this);
	}
});
Dialog.Native = {
	alert: function(message) {
		return new Dialog.Base({content: message, modal: true});
	},

	confirm: function(question, handler) {
		return new Dialog.Base({
			content: question, modal: true,
			buttons: [
				{text: 'Yes', close: true, onclick: function(event) {event.stop(); handler(true);}},
				{text: 'No', close: true, onclick: function(event) {event.stop(); handler(false);}}
			]
		});
	},

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
Dialog.Ajax = Class.create(Dialog.Base, {
	defaultOptions: Object.extendAll({}, Dialog.Base.prototype.defaultOptions, {
		ajax: {method: 'get'},
		closeOnFailure: true
	}),

	initialize: function($super, path, options) {
		this.path = path;
		$super(options);
	},

	create: function() {
		var loader = new Image();
		loader.onload = function() {
			this.dialog = new Element('img', {src: loader.src, alt: 'Loading, please wait&#8230;'});
			$(document.body).insert(this.dialog);
			this.layout();
			Dialog.register(this);
			var request = new Ajax.Request(this.path, Object.extend(this.options.ajax || {}, {
				onComplete: function(transport) {
					if (request.success()) {
						var z = this.dialog.getStyle('zIndex');
						this.dialog.remove();
						this.createElements();
						this.dialog.setStyle({zIndex: z});
						this.setContents(transport);
						this.layout();
						this.show();
					} else if (this.options.closeOnFailure) {
						this.close();
					}
				}.bind(this)
			}));
		}.bind(this);
		loader.src = Dialog.Options.assetPrefix + Dialog.Options.busyImage;
	},

	setContents: function(transport) {
		this.contents.update(transport.responseText);
	}
});
