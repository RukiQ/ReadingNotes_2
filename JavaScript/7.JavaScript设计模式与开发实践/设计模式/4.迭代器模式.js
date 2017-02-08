// ===================== 1. 实现自己的迭代器 ===================
// (1) 内部迭代器
var each = function(ary, callback) {
    for (var i = 0, l = ary.length; i < l; i++) {
        callback.call(ary[i], i, ary[i]); // 把下标和元素当作参数传给 callback 函数
    }
};
each([1, 2, 3], function(i, n) {
    alert([i, n]);
});


// (2) 外部函数
var Iterator = function( obj ){
	var current = 0;
		var next = function(){
		current += 1;
	};

	var isDone = function(){
		return current >= obj.length;
	};

	var getCurrItem = function(){
		return obj[ current ];
	};

	return {
		next: next,
		isDone: isDone,
		getCurrItem: getCurrItem
	}
};

var compare = function( iterator1, iterator2 ){
	while( !iterator1.isDone() && !iterator2.isDone() ){
		if ( iterator1.getCurrItem() !== iterator2.getCurrItem() ){
			throw new Error ( 'iterator1 和 iterator2 不相等' );
		}
		iterator1.next();
		iterator2.next();
	}

	alert ( 'iterator1 和 iterator2 相等' );
}

var iterator1 = Iterator( [ 1, 2, 3 ] );
var iterator2 = Iterator( [ 1, 2, 3 ] );

compare( iterator1, iterator2 ); // 输出： iterator1 和 iterator2 相等


// ===================== 2. 迭代类数组对象和字面量对象 ===================
// jquery 中的 $.each
$.each = function( obj, callback ) {
	var value,
		i = 0,
		length = obj.length,
		isArray = isArraylike( obj );

	if ( isArray ) { // 迭代类数组
		for ( ; i < length; i++ ) {
			value = callback.call( obj[ i ], i, obj[ i ] );
		
			if ( value === false ) {
			break;
			}
		}
	} else {
		for ( i in obj ) { // 迭代 object 对象
			value = callback.call( obj[ i ], i, obj[ i ] );
			if ( value === false ) {
				break;
			}
		}
	}
	return obj;
};



// ===================== 3. 倒序迭代器 ===================
var reverseEach = function(ary, callback) {
	for (var l = ary.length - 1; l >= 0; l--) {
		callback(l, ary[l]);
	}
};

reverseEach([0, 1, 2], function(i, n) {
	console.log(n);	// 分别输出：2, 1, 0
});



// ===================== 4. 中止迭代器 ===================
var each = function( ary, callback ){
	for ( var i = 0, l = ary.length; i < l; i++ ){
		if ( callback( i, ary[ i ] ) === false ){ // callback 的执行结果返回 false，提前终止迭代
			break;
		}
	}
};

each( [ 1, 2, 3, 4, 5 ], function( i, n ){
	if ( n > 3 ){ // n 大于 3 的时候终止循环
		return false;
	}
	console.log( n ); // 分别输出： 1, 2, 3
});



// ===================== 5. 迭代器模式的应用举例 ===================
var getActiveUploadObj = function(){
	try{
		return new ActiveXObject( "TXFTNActiveX.FTNUpload" ); // IE 上传控件
	}catch(e){
		return false;
	}
};

var getFlashUploadObj = function(){
	if ( supportFlash() ){ // supportFlash 函数未提供
		var str = '<object type="application/x-shockwave-flash"></object>';
		return $( str ).appendTo( $('body') );
	}
	return false;
};

var getFormUpladObj = function(){
	var str = '<input name="file" type="file" class="ui-file"/>'; // 表单上传
	return $( str ).appendTo( $('body') );
};

var iteratorUploadObj = function(){
	for ( var i = 0, fn; fn = arguments[ i++ ]; ){
		var uploadObj = fn();
		if ( uploadObj !== false ){
			return uploadObj;
		}
	}
};

var uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj );