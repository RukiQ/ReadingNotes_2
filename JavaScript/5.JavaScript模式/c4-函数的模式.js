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


//=================================== 3.自定义函数(?) ===================================

/**
 * 自定义函数（惰性函数自定义）：可以更新自身的实现
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


/**
 * 即时函数传参
 */
(function(global) {
  // 通过 'global' 访问全局变量
}(this));


/**
 * 即时函数的返回值
 */
// 写法1——>推荐
var result = (function(){
  return 2 + 2;
}());

// 写法2
var result = function() {
  return 2 + 2;
}();

// 写法3
var result = (function(){
  return 2 + 2;
})();

//================================== 5.即时对象初始化 =================================
/**
 * 即时对象初始化
 */
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


//================================== 6.初始化时分支 =================================

/**
 * 初始化时分支
 */
// 之前
var utils = {
  addListener: function(el, type, fn) {
    if (typeof window.addEventListener === 'function') {
      el.addEventListener(type, fn, false);
    } else if (typeof document.attachEvent === 'function') {
      el.attachEvent('on' + type, fn);
    } else {
      el['on' + type] = fn;
    }
  },
  removeListener: function(el, type, fn) {
    // 几乎一样...
  }
};


// 之后：可以在脚本初始化加载时一次性探测出浏览器特征

// 接口
var utils = {
  addListener: null,
  removeListener: null
}
// 实现
if (typeof window.addEventListener === 'function') {
  utils.addListener = function(el, type, fn) {
    el.addEventListener(type, fn, false);
  };
  utils.removeListener = function(el, type, fn) {
    el.removeEventListener(type, fn, false);
  };

  // 判断为IE浏览器
} else if (typeof document.attachEvent === 'function') {
  utils.addListener = function(el, type, fn) {
    el.attachEvent('on' + type, fn);
  };
  utils.removeListener = function(el, type, fn) {
    el.detachEvent('on' + type, fn);
  }

  // 更早版本浏览器
} else {
  utils.addListener = function(el, type, fn) {
    el['on' + type] = fn;
  };
  utils.removeListener = function(el, type, fn) {
    el['on' + type] = null;
  }
}


//================================= 7.备忘模式（函数属性） =================================

/**
 * 函数属性
 */
var myFunc = functino(param) {
  if (!myFunc.cache[param]) {
    var result = {};
    //... 开销很大的操作 ...
    myFunc.cache[param] = result;
  }

  return myFunc.cache[param];
};

// 缓存存储
myFunc.cache = {};


/**
 * 优化点
 */
var myFunc = functino() {
    
    // 1.参数优化：如果有更多及复杂的参数，可以将它们序列化为一个JSON字符串
    var cachekey = JSON.stringify(Array.prototype.slice.call(arguments)),
        result;

    // 2.使用 arguments.callee 来引用该函数，在ES5的严格模式中不支持
    var f = arguments.callee;

    if (!f.cache[cachekey]) {
        var result = {};
        //... 开销很大的操作 ...
        f.cache[cachekey] = result;
    }

    return f.cache[cachekey];
};

// 缓存存储
myFunc.cache = {};



//================================== 8.配置对象 ===================================

/**
 * 配置对象
 */
var conf = {
  username: 'batman',
  first: 'Bruce',
  last: 'Wayne'
};

addPerson(conf);


//================================== 9.Curry化 ===================================
// 定义函数
var sayHi = function(who) {
    return "Hello" + (who ? "," + who : "") + "!";
};

// 调用函数
sayHi();    //'Hello'
sayHi('world'); // 'Hello, world'

// 应用函数1
sayHi.apply(null, ["hello"]);   // 'Hello, hello!'

// 应用函数2：使用 call() 方法比 apply() 更有效率，节省了一个数组
sayHi.call(null, 'hello');  // 'Hello, hello!'


/**
 * curry化的add()函数
 * 接受部分参数列表
 */
// x 隐式地存储在闭包中，并且还将 y 作为局部变量复用
function add(x,y) {
  if (typeof y === 'undefined') {  // 部分
    return function(y) {
      return x + y;
    }
  }
  // 完全应用
  return x + y;
}

typeof add(5);  // 'function'
add(3)(4);  // 7
// 创建并存储一个新函数
var add2000 = add(2000);
add2000(10);  // '2010'


/**
 * 通用curry化函数示例
 */
function schonofinkelize(fn) {
  var slice = Array.prototype.slice,
      stored_args = slice.call(arguments, 1);
  return function() {
    var new_args = slice.call(arguments),
        args = stored_args.concat(new_args);
    return fn.apply(null, args);
  }
}

// 普通函数
function add(x, y) {
  return x + y;
}

// 将一个函数curry化以获得一个新的函数
var newadd = schonofinkelize(add, 5);
newadd(4);  // 9

//另一种选择——直接调用新函数
schonofinkelize(add, 6)(7);