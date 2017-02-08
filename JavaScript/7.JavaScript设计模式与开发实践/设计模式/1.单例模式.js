// ===================== 1. 实现单例模式 ===================
var Singleton = function(name) {
	this.name = name;
	this.instance = nu;;
};

Singleton.prototype.getName = function() {
	alert(this.name);
};

Singleton.getInstance = function(name) {
	if (!this.instance) {
		this.instance = new Singleton(name);
	}
	return this.instance;
};

var a = Singleton.getInstance('sven1');
var b = Singleton.getInstance('sven2');

alert(a === b);	// true

// 或者
var Singleton = function(name) {
	this.name = name;
};

Singleton.prototype.getName = function() {
	alert(this.name);
};

Singleton.getInstance = (function() {
	var instance = null;
	return function(name) {
		if (!instance) {
			instance = new Singleton(name);
		}
		return instance;
	}
})();


// ===================== 2.透明的单例模式 ===================
var CreateDiv = (function() {
	var instance;

	var CreateDiv = function(html) {
		if (instance) {
			return instance;
		}
		this.html = html;
		this.init();

		return instance = this;
	};

	CreateDiv.prototype.init = function() {
		var div = document.createElement('div');
		div.innerHTML = this.html;
		document.body.appendChild(div);
	};

	return CreateDiv;
})();

var a = new CreateDiv('sven1');
var b = new CreateDiv('sven2');

alert(a === b);	// true


// ===================== 3.用代理实现单例模式 ===================
var CreateDiv = function(html) {
	this.html = html;
	this.init();
};

CreateDiv.prototype.init = function() {
	var div = document.createElement('div');
	div.innerHTML = this.html;
	document.body.appendChild(div);
};

// 引入代理类
var ProxySingletonCreateDiv = (function() {
	var instance;
	return function(html) {
		if (!instance) {
			instance = new CreateDiv(html);
		}
		return instance;
	}
})();

var a = new ProxySingletonCreateDiv('sven1');
var b = new ProxySingletonCreateDiv('sven2');

alert(a === b);


// ===================== 4.JavaScript 中的单例模式 ===================
// 单例模式的核心是确保只有一个实例，并提供全局访问
// 采用全局变量，并且降低全局命名污染

// (1)使用命名空间
var namespace = {
	a: function() {
		alert(1);
	},
	b: function() {
		alert(2);
	}
};

// 动态地创建命名空间
var MyApp = {};
MyApp.namespace = function(name) {
	var parts = name.split('.');
	var current = MyApp;
	for (var i in parts) {
		if (!current[parts[i]]) {
			current[parts[i]] = {};
		}
		current = current[parts[i]];
	}
};

MyApp.namespace('event');
MyApp.namespace('dom.style');

console.dir(MyApp);

// 上述代码等价于：
var MyApp = {
	event: {},
	dom: {
		style: {}
	}
};

// (2)使用闭包封闭私有变量
var user = (function() {
	var __name = 'sven',
		__age = 29;

	return {
		getUserInfo: function() {
			return __name + '-' + __age;
		}
	}
})();


// ===================== 5.惰性单例 ===================
var createLoginLayer = (function() {
	var div;
	return function() {
		if (!div) {
			div = document.createElement('div');
			div.innerHTML = '我是登录浮窗';
			div.style.display = 'none';
			document.body.appendChild(div);
		}

		return div;
	}
})();

document.getElementById( 'loginBtn' ).onclick = function(){
	var loginLayer = createLoginLayer();
	loginLayer.style.display = 'block';
};


// ===================== 6.通用的惰性单例 ===================
var getSingle = function(fn) {
	var result;
	return function() {
		return result || (result = fn.apply(this, arguments));
	}
};

var createLoginLayer = function(){
	var div = document.createElement( 'div' );
	div.innerHTML = '我是登录浮窗';
	div.style.display = 'none';
	document.body.appendChild( div );
	return div;
};

var createSingleLoginLayer = getSingle( createLoginLayer );

document.getElementById( 'loginBtn' ).onclick = function(){
	var loginLayer = createSingleLoginLayer();
	loginLayer.style.display = 'block';
};

// 创建唯一的 iframe 用于动态加载第三方页面
var createSingleIframe = getSingle( function(){
	var iframe = document.createElement ( 'iframe' );
	document.body.appendChild( iframe );
	return iframe;
});

document.getElementById( 'loginBtn' ).onclick = function(){
	var loginLayer = createSingleIframe();
	loginLayer.src = 'http://baidu.com';
};