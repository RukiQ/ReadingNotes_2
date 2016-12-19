// 定义EventUtil对象方法
var EventUtil = {

	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},

	getEvent: function(event) {
		return event ? event : window.event;
	},

	getTarget: function(event) {
		return event.targete || event.srcElement;
	},

	preventDefault: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.retrunValue = false;
		}
	},

	removeHandler: function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	},

	stopPropagation: function(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancleBubble = true;
		}
	}
}

// 使用EventUtil对象
var btn = document.getElementById("myBtn");
var handler = function() {
	alert("Clicked");
}

EventUtil.addHandler(btn, "click", handler);

btn.onclick = function(event) {
	event.EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	EventUtil.preventDefault(event);
	EventUtil.stopPropagation(event);
}

EventUtil.removeHandler(btn, "click", handler);