//============================ 使用类式继承时的预期结果 ========================
// 父构造函数
function Parent(name) {
  this.name = name || 'Adam';
}

Parent.prototype.say = function() {
  return this.name;
}

// 空白的子构造函数
function Child(name) {}

// 继承
inherit(Child, Parent);

//========================== 1.默认模式：追溯原型链 ==========================
function inherit(C, P) {
  C.prototype = new P();
}

var kid = new Child();
kid.say();  // 'Adam'

//========================== 2.借用构造函数 ==========================
function Child(name) {
  Parent.apply(this, arguments);
}

var kid = new Chlid('Patrick');
kid.name; // 'Patrick'
typeof kid.say; // 'undefined'

//========================== 3.借用和设置原型 ==========================
function Chlid(name) {
  Parent.apply(this, arguments);
}

Child.prototype = new Parent(); // 第一次调用

var kid = new Chlid('Patrick'); // 第二次调用
kid.name; // 'Patrick'
kid.say();  // 'Patrick'
delete kid.name;
kid.say();  // 'Adam'


//========================== 4.共享原型 ==========================
function inherit(C, P) {
  C.prototype = P.ptototype;
}

//========================== 5.临时构造函数 ==========================
function inherit(C, P) {
  var F = function() {};
  F.prototype = P.prototype;
  C.prototype = new F();

  // 存储超类
  C.uber = P.ptototype;

  // 重置构造函数指针
  C.prototype.constructor = C;
}

var kid = new Child();

/**
 * 优化：避免在每次需要继承时都创建临时（代理）构造函数
 */
var inherit = (function() {
  var F = function() {};
  return function(C, P) {
    F.prototype = P.prototype;
    C.prototype = new F();
    C.uber = P.prototype;
    C.prototype.constructor = C;
  }
}());


//========================== 6.原型继承 ==========================
/**
 * 使用字面量创建父对象
 */
var parent = {
  name: 'Papa'
};

function object(o) {
  function F() {};
  F.prototype = o;
  return new F();
}

// 新对象
var child = object(parent);

/**
 * 使用构造函数创建父对象
 */
function Person() {
  this.name = 'Adam';
}

Person.prototype.getName = function() {
  return this.name;
}

/**
 * 继承方法1
 */
var papa = new Person();
var kid = object(papa);
kid.getName();  // 'Adam'

/**
 * 继承方法2：
 * 仅继承现有构造函数的原型对象
 */
var kid2 = object(Person.prototype);

typeof kid.getName;   // 'function'
typeof kid.name;  // 'undefined'

/**
 * 继承方法3：
 * 使用 Object.create()，可以扩展新对象自身的属性，并返回该新对象
 */
var child = Object.create(parent);
var child2 = Object.create(parent, {
  age: {value: 2}
})
child2.hasOwnProperty('age'); // true


//========================== Klass ==========================
var klass = function(Parent, props) {
  var Child, F, i;

  // 1. 新构造函数
  Child = function() {
    if (Child.uber && Child.uber.hasOwnProperty("__construct")) {
      Child.uber.__construct.apply(this, arguments);
    }
    if (Child.prototype.hasOwnProperty("__construct")) {
      Child.prototype.__construct.apply(this, arguments);
    }
  };

  // 2. 继承
  Parent = Parent || Object;
  F = function() {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.uber = Parent.prototype;
  Child.prototype.constructor = Child;

  // 3. 添加实现方法
  for (i in props) {
    if (props.hasOwnProperty) {
      Child.prototype[i] = props[i];
    }
  }

  // 返回该 'class'
  return Child;
}

// 测试
var Man = klass(null, {
  __construct: function(what) {
    console.log("Man's constructor");
    this.name = what;
  },
  getName: function() {
    return this.name;
  }
});

var SuperMan = klass(Man, {
  __construct: function(what) {
    console.log("SuperMan's constructor");
  },
  getName: function() {
    var name = SuperMan.uber.getName.call(this);
    return "I am " + name;
  }
});

var clark = new SuperMan('Clark Kent');
clark.getName();  // 'I am Clark Kent'

//========================== 7.通过复制属性实现继承 ==========================
/**
 * 浅复制
 */ 
function extend(parent, child) {
  var i;
  child = child || {};
  for (i in parent) {
    if (parent.hasOwnProperty(i)) {
      child[i] = parent[i];
    }
  }
  return child;
}

var dad = {name: 'Adam'};
var kid = extend(dad);
kid.name; // 'Adam'

/**
 * 深复制
 */ 
function extendDeep(parent, child) {
  var i,
      toStr = Object.prototype.toString,
      astr = '[object Array]';

  child = child || {};

  for (i in parent) {
    if (parent.hasOwnProperty(i)) {
      if (typeof parent[i] === 'object') {
        child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
        extendDeep(parent[i], child[i]);
      } else {
        child[i] = parent[i];
      }
    }
  }
  return child;
}

// 测试
var dad = {
  counts: [1, 2, 3],
  reads: {paper: true}
};
var kid = extendDeep(dad);

kid.counts.push(4);
kid.counts.toString();  // '1,2,3,4'
dad.counts.toString();  // '1,2,3'


//========================== 8.混入模式 ==========================
function mix() {
  var arg, prop, child = {};
  for (arg = 0; arg < arguments.length; arg += 1) {
    for (prop in arguments[arg]) {
      if (arguments[arg].hasOwnProperty(prop)) {
        child[prop] = arguments[arg][prop];
      }
    }
  }
  return child;
}

var cake = mix(
  {egg: 2, large: true},
  {butter: 1, salted: true},
  {flour: '3 cups'},
  {sugar: 'sure!'}
);


//========================== 9.借用方法 ==========================
/**
 * 借用数组的方法
 */
function f() {
  var args = [].slice.call(arguments, 1, 3);
  // 或者
  // var args = Array.prototype.slice.call(arguments, 1, 3);
  return args;
}

f(1, 2, 3, 4, 5, 6);  // [2, 3] 

/**
 * 借用和绑定
 */
var one = {
  name: 'object',
  say: function(greet) {
    return greet + ', ' + this.name;
  }
};

one.say('hi');  // 'hi, object'

var two = {
  name: 'another object'
};

one.say.apply(two, ['hello']);  // 'hello, another object'
one.say.call(two, 'bye'); // "bye, another object"
var say = one.say.bind(two, 'bind');
say();  // "bind, another object"

/**
 * this都指向了全局对象
 */
// 给变量赋值
// `this` 将指向全局变量
var say = one.say;
say('hoho'); // 'hoho, '

// 作为回调函数
var yetanother = {
  name: 'Yet another object',
  method: function(callback) {
    return callback('Hola');
  }
};
yetanother.method(one.say); // 'Hola, '

/**
 * 解决办法：bind()函数
 */
function bind(o, m) {
  return function() {
    return m.apply(o, [].slice.call(arguments));
  };
}

var twosay = bind(two, one.say);
twosay('yo'); // 'yo, another object';

/**
 * Function.prototype.bind()实现
 */
if (typeof Function.prototype.bind === 'undefined') {
  Function.prototype.bind = function(thisArg) {
    var fn = this, 
        slice = Array.prototype.slice,
        args = slice.call(arguments, 1);

    return function() {
      return fn.apply(thisArg, args.concat(slice.call(arguments)));
    };
  };
}

var twosay2 = one.say.bind(two);
twosay2('Bonjour'); // 'Bonjour, another object'

var twosay3 = one.say.bind(two, 'Enchante');
twosay3(); // 'Enchante, another object'