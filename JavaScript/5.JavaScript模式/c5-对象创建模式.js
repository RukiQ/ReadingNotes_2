//=================================== 1.命名空间模式 =================================
// 全局变量，不安全
var MYAPP = {};

// 更好的代码风格
if (typeof MYAPP === 'undefined') {
    var MYAPP = {};
}

// 或者用更短的语句
var MYAPP = MYAPP || {};

// 构造函数
MYAPP.Parent = function() {};
MYAPP.Child = function() {};

// 一个变量
MYAPP.some_var = 1;

// 一个对象容器
MYAPP.modules = {};

// 嵌套对象
MYAPP.modules.module1 = {};
MYAPP.modules.module1.data = {a: 1, b: 2};
MYAPP.modules.module2 = {};

/**
 * 通用命名空间函数实现示例：
 */
var MYAPP = MYAPP || {};

MYAPP.namespace = function(ns_string) {
    var parts = ns_string.split('.'),
        parent = MYAPP,
        i;

    // 剥离最前面的冗余全局变量
    if (parts[0] === 'MYAPP') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i++) {
        // 如果它不存在，就创建一个属性
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }

    return parent;
}

// 测试：
// 将返回值赋给一个局部变量
var module2 = MYAPP.namespace('MYAPP.modules.module2');
module2 === MYAPP.modules.module2;  // true

// 忽略最前面的'MYAPP'
MYAPP.namespace('modules.module51');


//=================================== 2.声明依赖模式 =================================
var myFunction = function() {
  // 依赖
  var event = YAHOO.util.Event,
      dom = YAHOO.util.Dom;

  // 使用事件和DOM变量
  // 下面的函数...
}


//================================= 3.私有属性和方法 =================================
/**
 * 利用构造函数+闭包实现私有成员
 */
function Gadget() {
  // 私有成员
  var name = "iPod";
  var color = ['red'];

  // 公有函数
  this.getName = function() {
    return name;
  };

  // 反模式
  // 不要传递需要保持私有性的对象和数组的引用
  this.getColor = function() {
    return color;
  };

}

var toy = new Gadget();

toy.name; // 'undefined'
toy.getName();  // 'iPod'

var newColor = toy.getColor();
newColor[0] = 'black';
toy.getColor();  // 'black'


//=============== 模块模式的基础框架：对象字面量以及私有性 ===================
/**
 * 使用对象字面量+匿名函数实现私有成员
 */
var myobj;
(function() {
  // 私有成员
  var name = 'my, oh my';

  // 实现公有部分
  // 注意，没有 'var' 修饰符
  myobj = {
    // 特权方法
    getName: function() {
      return name;
    }
  }
}());

myobj.getName();  // 'my, oh my'

/**
 * 实现2
 */
var myobj = (function() {
  // 私有成员
  var name = 'my, oh my';

  // 实现公有部分
  return {
    getName: function() {
      return name;
    }
  }
}());

myobj.getName();  // 'my, oh my'


//=============== 原型和私有性 ===================
function Gadget() {
  // 私有成员
  var name = 'iPod';
  // 公有函数
  this.getName = function() {
    return name;
  };
}

Gadget.prototype = (function() {
  // 私有成员
  var browser = "Mobile Webkit";
  // 公有原型成员
  return {
    getBrowser: function() {
      return browser;
    }
  };
}());

var toy = new Gadget();
toy.getName();  // 特权 'own' 方法
toy.getBrowser(); // 特权原型方法


//=============== 将私有方法揭示为公共方法 ===================
/**
 * 它建立在其中一种私有模式之上，即对象字面量中的私有成员
 */
var myarray;
(function() {
  var astr = '[object Array]',
      toString = Object.prototype.toString;

  function isArray(a) {
    return toString.call(a) === astr;
  }

  function indexOf(haystack, needle) {
    var i = 0,
        max = haystack.length;
    for (; i < max; i += 1) {
      if (haystack[i] === needle) {
        return i;
      }
    }
    return -1;
  }

  myarray = {   // 填充了认为适于公共访问的功能
    isArray: isArray,
    indexOf: indexOf,   // 如果公共indexOf方法发生意外，私有indexOf方法仍然是安全的
    inArray: indexOf    // inArray()将继续正常运行
  };
}());


//================================= 4.模块模式 =================================
// 第一步：建立一个命名空间
MYAPP.namespace('MYAPP.utilities.array');

// 第二步：定义该模块
MYAPP.utilities.array = (function() {

      // 依赖
  var uobj = MYAPP.utilities.object,
      ulang = MYAPP.utilities.lang,

      // 私有属性
      array_string = '[object Array]',
      ops = Object.prototype.toString;

      // 私有方法
      // ...

      // var 变量定义结束

  // 可选的一次性初始化过程
  // ...

  // 第三步：向公共接口添加一些方法
  // 公有API
  return {
    return {
      inArray: function(needle, haystack) {
        // ...
      },
      isArray: function(a) {
        // ...
      }
      // ... 更多方法和属性
    };
  }
}());

/**
 * 揭示模块模式
 */
MYAPP.utilities.array = (function() {

  // 私有属性
  // 私有方法
  isArray = function() {

  },
  inArray = function() {

  };

  // 揭示公有API
  return {
    isArray: isArray,
    inArray: inArray
  }
})();

/**
 * 创建构造函数的模块
 */
MYAPP.utilities.array = (function() {

  // 私有属性和方法
  var Constr;

  // 公有API——构造函数
  Constr = function(o) {
    this.elements = this.toArray(0);
  };
  
  // 公有API——原型
  Constr.prototype = {
    constructor: MYAPP.utilities.Array,
    version: '2.0',
    toArray: function(obj) {
      for (var i = 0, a = [], len = obj.length; i < len; i += 1) {
        a[i] = obj[i];
      }
      return a;
    }
  }

  // 返回要分配给新命名空间的构造函数
  return Constr;
})();

// 使用
var arr = new MYAPP.utilities.Array(obj);

/**
 * 将全局变量导入到模块中
 */
MYAPP.utilities.module = (function(app, global) {

  // 引用全局变量
  // 以及现在被转换成局部变量的
  // 全局应用程序命名空间对象

}(MYAPP, this));



//================================= 5.沙箱模式 =================================
/**
 * 多次实例化沙箱对象的方法：
 */
new SandBox(function(box) {
  // 你的代码写在这里...
});

SandBox(['ajax', 'event'], function(box) {
  // console.log(box);
});

SandBox('ajax', 'dom', function(box) {
  // console.log(box);
});

SandBox('*', function(box) {
  // console.log(box);
});

SandBox(function(box) {
  // console.log(box);
});


//===============================
/**
 * 将一个模块嵌入到另一个模块中，且这两者之间不会相互干扰
 */
SandBox('dom', 'event', function(box) {
  // 使用 DOM 和事件来运行
  Sandbox('ajax', function(box) {
    // 另一个沙箱化（sandboxed）的'box'对象
    // 这里的'box'对象与函数外部的
    // 'box'并不相同

    //...
    // 用Ajax来处理
  });

  // 这里没有Ajax模块
})


//===============================
// 增加模块
Sandbox.modules = {};

Sandbox.modules.dom = function(box) {
  box.getElement = function() {};
  box.getStyle = function() {};
  box.foo = 'bar';
};

Sandbox.modules.event = function(box) {
  // 如果需要，就访问Sandbox原型，如下语句
  box.constructor.prototype.m = 'mmm';
  box.attachEvent = function() {};
  box.dettachEvent = function() P{;}
};

Sandbox.modules.ajax = function(box) {
  box.makeRequest = function() {};
  box.getResponse = function() {};
};


//===============================
// 实现 Sandbox() 构造函数
function Sandbox() {
  // 将参数转换成一个数组
  var args = Array.prototype.slice.call(arguments),
    // 最后一个参数是回调函数
    callback = args.pop(),
    // 模块可以作为一个数组传递，或作为单独的参数传递
    modules = (args[0] && typeof args[0] === 'string') ? args : args[0],
    i;

    // 确保该函数
    // 作为构造函数被调用
    if (!(this instanceof Sandbox)) {
      return new Sandbox(module, callback);
    }

    // 需要向 `this` 添加的属性
    this.a = 1;
    this.b = 2;

    // 现在向该核心`this`对象添加模块
    // 不指定模块名称或指定"*"都表示"使用所有模块"
    if (!module || module === '*') {
      module = [];
      for (i in Sandbox.modules) {
        if (Sandbox.modules.hasOwnProperty(i)) {
          modules.push(i);
        }
      }
    }

    // 初始化所需的模块
    for (i=0; i<moduels.length; i++) {
      Sandbox.modules[modules[i]](this);
    }

    // call the callback
    callback(this);
}

// 需要的任何原型属性
Sandbox.prototype = {
  name: 'My Application',
  version: '1.0',
  getName: function() {
    return this.name;
  }
}


//===============================公有静态成员=========================
/**
 * 通过使用构造函数并向其添加属性
 */
var Gadget = function(price) {
  this.price = price;
};

// 静态方法
Gadget.isShiny = function() {

  var msg = 'you bet';

  if (this instanceof Gadget) {
    msg += ', it costs $' + this.price + '!';
  }

  return msg;
}

// 向该原型添加一个普通方法
Gadget.prototype.setPrice = function() {
  return Gadget.isShiny.call(this);
}

// 测试静态方法调用
Gadget.isShiny(); // 'you bet'

// 测试实例，非静态调用
var a = new Gadget('499.99');
a.isShiny();  // 'you bet, it costs $499.99!'


//===============================私有静态成员=========================
var Gadget = (function() {
  // 静态变量/属性
  var counter = 0,
      NewGadget;

  // 这将成为
  // 新的构造函数的实现
  NewGadget = function() {
    counter += 1;
  };

  // 特权方法
  NewGadget.prototype.getLastId = function() {
    return counter;
  }

  // 覆盖该构造函数
  return NewGadget;
}());

var iphone = new Gadget();
iphone.getLastId(); // 1
var ipod = new Gadget();
ipod.getLastId(); // 2
var ipad = new Gadget();
ipad.getLastId(); // 3


//================================= 6.链模式 =================================
var obj = {
  value: 1,
  increment: function() {
    this.value += 1;
    return this;
  },
  add: function(v) {
    this.value += v;
    return this;
  },
  shout: function() {
    console.log(this.value);
  }
};

// 链方法调用
obj.increment().add(3).shout(); // 5


//================================= 7. method()方法  语法糖 =================================
var Person = function(name) {
  this.name = name;
}.
  method('getName', function() {
    return this.name;
  }).
  method('setName', function() {
    this.name = name;
    return this;
  });

if (typeof Function.prototype.method !== 'function') {
  Function.prototype.method = function(name, implementation) {
    this.prototype[name] = implementation;
    return this;
  };
}