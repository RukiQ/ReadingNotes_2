// ===================== 1. 自定义事件 ===================
var salesOffices = {};	// 定义售楼处

salesOffices.clientList = [];	// 缓存列表，存放订阅者的回调函数

salesOffices.listen = function(fn) {	// 增加订阅者
	this.clientList.push(fn);	// 订阅的消息添加进缓存列表
};

salesOffices.trigger = function() {	// 发布消息
	for(var i = 0, fn; fn = this.clientList[i++];) {
		fn.apply(this, arguments);	// arguments 是发布消息时带上的参数
	}
};

// 测试
salesOffices.listen(function(price, squareMeter) {	// 小明订阅消息
	console.log('价格= ' + price);
	console.log( 'squareMeter= ' + squareMeter );
});

salesOffices.listen(function(price, squareMeter) {	//小红订阅消息
	console.log('价格= ' + price);
	console.log( 'squareMeter= ' + squareMeter )
});

salesOffices.trigger( 2000000, 88 ); // 输出： 200 万， 88 平方米
salesOffices.trigger( 3000000, 110 ); // 输出： 300 万， 110 平方米


// ===================== 2. 改写之后：订阅者可以只订阅自己感兴趣的事件 ===================
var salesOffices = {}; // 定义售楼处
salesOffices.clientList = {}; // 缓存列表，存放订阅者的回调函数

salesOffices.listen = function( key, fn ){
	if ( !this.clientList[ key ] ){ // 如果还没有订阅过此类消息，给该类消息创建一个缓存列表
		this.clientList[ key ] = [];
	}
	this.clientList[ key ].push( fn ); // 订阅的消息添加进消息缓存列表
};

salesOffices.trigger = function(){ // 发布消息
	var key = Array.prototype.shift.call( arguments ), // 取出消息类型
		fns = this.clientList[ key ]; // 取出该消息对应的回调函数集合
	
	if ( !fns || fns.length === 0 ){ // 如果没有订阅该消息，则返回
		return false;
	}

	for( var i = 0, fn; fn = fns[ i++ ]; ){
		fn.apply( this, arguments ); // (2) // arguments 是发布消息时附送的参数
	}
};

salesOffices.listen( 'squareMeter88', function( price ){ // 小明订阅 88 平方米房子的消息
	console.log( '价格= ' + price ); // 输出： 2000000
});

salesOffices.listen( 'squareMeter110', function( price ){ // 小红订阅 110 平方米房子的消息
	console.log( '价格= ' + price ); // 输出： 3000000
});

salesOffices.trigger( 'squareMeter88', 2000000 ); // 发布 88 平方米房子的价格
salesOffices.trigger( 'squareMeter110', 3000000 ); // 发布 110 平方米房子的价格



// ===================== 3. 发布－订阅模式的通用实现 ===================
var event = {
	clientList: [],
	listen: function(key, fn) {
		if (!this.clientList[key]) {
			clientList[key] = [];
		}
		this.clientList[key].push(fn);	// 订阅的消息添加进缓存列表
	},
	trigger: function() {
		var key = Array.prototype.shift.call(arguments),
			fns = this.clientList[key];

		if (!fns || fns.length === 0) {	// 如果没有绑定对应的消息
			return false;
		}

		for (var i = 0, fn; fn = fns[i++]) {
			fn.apply(this, arguments);	//  arguments 是 trigger 时带上的参数
		}
	}
};

// installEvent函数：可以给所有对象都动态安装发布-订阅功能
var installEvent = function( obj ){
	for ( var i in event ){
		obj[ i ] = event[ i ];
	}
};

// 测试
var salesOffices = {};
installEvent( salesOffices );

salesOffices.listen( 'squareMeter88', function( price ){ // 小明订阅消息
	console.log( '价格= ' + price );
});

salesOffices.listen( 'squareMeter100', function( price ){ // 小红订阅消息
	console.log( '价格= ' + price );
});
salesOffices.trigger( 'squareMeter88', 2000000 ); // 输出： 2000000
salesOffices.trigger( 'squareMeter100', 3000000 ); // 输出： 3000000



// ===================== 4. 取消订阅的事件 ===================
event.remove = function(key, fn) {
	var fns = this.clientList[key];

	if (!fns) {	// 如果 key 对应的消息没有被人订阅，则直接返回
		return false;
	}

	if (!fn) {	// 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
		fns && (fns.length = 0);
	} else {
		for (var l = fns.length - 1; l >= 0; l--) {	// 反向遍历订阅的回调函数列表
			var _fn = fns[l];
			if (_fn === fn) {
				fns.splice(l, 1);	// 删除订阅者的回调函数
			}
		}
	}
};

var salesOffices = {};
var installEvent = function( obj ){
	for ( var i in event ){
		obj[ i ] = event[ i ];
	}
}

installEvent( salesOffices );

salesOffices.listen( 'squareMeter88', fn1 = function( price ){ // 小明订阅消息
	console.log( '价格= ' + price );
});

salesOffices.listen( 'squareMeter88', fn2 = function( price ){ // 小红订阅消息
	console.log( '价格= ' + price );
});

salesOffices.remove( 'squareMeter88', fn1 ); // 删除小明的订阅
salesOffices.trigger( 'squareMeter88', 2000000 ); // 输出： 2000000



// ===================== 5. 全局的发布－ 订阅对象 ===================
var Event = (function() {
	var clientList = {},
		listen,
		trigger,
		remove;

	listen = function(key, fn) {
		if (!clientList[key]) {
			clientList[key] = [];
		}
		clientList[key].push(fn);
	};

	trigger = function() {
		var key = Array.prototype.shift.call(arguments),
			fns = clientList[key];

		if (!fns || fns.length === 0) {
			return false;
		}

		for (var i = 0, fn; fn = fns[i++];) {
			fn.apply(this, arguments);
		}
	};

	remove = function(key, fn) {
		var fns = clientList[key];
		if (!fns) {
			return false;
		}

		if (!fn) {
			fns && (fns.length = 0);
		} else {
			for (var l = fns.length - 1; l >= 0; l--) {
				var _fn = fns[l];
				if (_fn === fn) {
					fn.splice(l, 1);
				}
			}
		}
	};

	return {
		listen: listen,
		trigger: trigger,
		remove: remove
	}
})();


Event.listen( 'squareMeter88', function( price ){ // 小红订阅消息
	console.log( '价格= ' + price ); // 输出： '价格=2000000'
});
Event.trigger( 'squareMeter88', 2000000 ); // 售楼处发布消息



// ===================== 6. 全局命名的事件冲突 ===================
// 。。。