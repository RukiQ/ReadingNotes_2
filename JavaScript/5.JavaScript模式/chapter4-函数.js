//=================================== 1.回调模式 ===================================

/**
 * 1.回调模式
 * 功能逻辑解耦
 */
var findNodes() = function(callback) {
  var i = 10000,
      nodes = [],
      found;

  // 检查回调函数是否为可调用的
  if (typeof callback !== 'function') {
    callback = false;
  }

  while (i) {
    i -= 1;

    // 运行回调函数
    if (callback) {
      callback(found);
    }

    nodes.push(found);
  }

  return nodes;  
}

/**
 * 解决回调中存在的作用域问题——>当回调作为对象的方法时
 * 解决方法：绑定作用域，传递该回调函数所属的对象
 */
var findNodes = function(callback, callback_obj) {
  //...
  if (typeof callback === 'function') {
    callback.call(callback_obj, found);
  }
}

//使用=>
findNodes(myapp.paint, myapp);

/**
 * 更好的方案：无需重复两次输入对象的名称
 */
var findNodes = function(callback, callback_obj) {
  if (typeof callback === 'string') {
    callback = callback_obj[callback];
  }

  //...
  if (typeof callback === 'function') {
    callback.call(callback_obj, found);
  }
  //...
}

//使用=>
findNodes('paint', myapp);


/**
 * 应用场景：
 */
// 异步事件监听器
document.addEventListener('click', console.log, false); 

// 超时
var thePlotThickens = function() {};
setTimeout(thePlotThickens, 500); //<=回调不带括号，带括号表示立即执行


//=================================== 2.返回函数 ===================================

/**
 * 闭包
 */
var setup = function() {
  var count = 0;
  return function() {
    return (count += 1);
  }
}

var next = setup();
next(); // 1
next(); // 2


//=================================== 3.自定义函数 ===================================

/**
 * 自定义函数：可以更新自身的实现
 * 当有一些初始化准备工作要做，并且仅需要执行一次，该模式就非常有用
 */
var scareMe = function() {
  console.log('Boo!');
  scareMe = function() {
    console.log('Double boo!');
  };
};

scareMe();  // 'Boo!'
scareMe();  // 'Double boo!'

/**
 * 自定义函数的缺点：
 * 1）当它重定义自身时已经添加到原始函数的任何属性都会丢失；
 * 2）如果函数使用了不同的名称，比如分配给不同的变量或者以对象的方法来使用，那么重定义部分将永远不会发生，并且将会执行原始函数体
 */
// 1.添加一个新的属性
scareMe.property = "properly";

// 2.赋值给另一个不同名称的变量
var prank = scareMe;

// 3.作为一个方法使用
var spooky = {
  boo: scareMe
};

prank();  // 'Boo!'
prank();  // 'Boo!'
console.log(prank.property);  // 'properly'

spooky.boo(); // 'Boo!'
spooky.boo(); // 'Boo!'
console.log(spooky.boo.property);  // 'properly'

scareMe();  // 'Double boo!'
scareMe();  // 'Double boo!'
console.log(scareMe.property);  // 'undefined'


//=================================== 4.即时函数 ===================================
/**
 * 即时函数
 */
// 写法1——>JSLint偏好该写法
(function() {
  //...
}());

// 写法2
(function() {

})();


// 即时函数传参
(function(global) {
  // 通过 'global' 访问全局变量
}(this));


// 即时函数的返回值，写法1——>推荐
var result = (function(){
  return 2 + 2;
}());

// 即时函数的返回值，写法2
var result = function() {
  return 2 + 2;
}();

// 即时函数的返回值，写法3
var result = (function(){
  return 2 + 2;
})();

//================================== 5.即时对象初始化 =================================
({
  // 在这里可以定义设定值
  // 又名配置常数
  maxwidth: 600,
  maxheight: 400,

  // 还可以定义一些实用的方法
  gimmeMax: function() {
    return this.maxwidth + 'x' + this.maxheight;
  },

  // 初始化
  init: function() {
    console.log(this.gimmeMax());
    // 更多初始化任务
  }
}).init();

// 语法
({...}).init();
({...}.init());

// 返回对对象的引用：在init()函数尾部添加 "return this;"