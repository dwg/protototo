Event.simulateEvent = function(element, eventName) {
	if (element.fireEvent) {
		element.fireEvent('on' + eventName);
	} else {
		var event = document.createEvent('Events');
		event.initEvent(eventName, true, true);
		element.dispatchEvent(event);
	}
};

Event.simulateClick = function(element) {
	Event.simulateEvent(element, 'click');
};

Event.simulateMouse = function(element, eventName) {
  var options = Object.extend({
    pointerX: 0,
    pointerY: 0,
    button: 0,
	clickCount: 1
  }, arguments[2] || {});
  var oEvent = document.createEvent("MouseEvents");
  oEvent.initMouseEvent(eventName, true, true, document.defaultView, 
    options.clickCount, options.pointerX, options.pointerY, options.pointerX, options.pointerY, 
    false, false, false, false, options.button, $(element));
  
  if(this.mark) Element.remove(this.mark);
  
  var style = 'position: absolute; width: 5px; height: 5px;' + 
    'top: #{pointerY}px; left: #{pointerX}px;'.interpolate(options) + 
    'border-top: 1px solid red; border-left: 1px solid red;'
    
  this.mark = new Element('div', { style: style });
  this.mark.appendChild(document.createTextNode(" "));
  document.body.appendChild(this.mark);
  
  if(this.step)
    alert('['+new Date().getTime().toString()+'] '+eventName+'/'+Test.Unit.inspect(options));
  
  $(element).dispatchEvent(oEvent);
};