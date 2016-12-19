### <p style="background:orange;">第一章 简介</p>

##### 模式
模式：是指一个通用问题的解决方案。

- 设计模式
- 编码模式
- 反模式


##### JavaScript 基本概念

JS 五种类型不是对象：数值类型（number）、字符串类型（string）、布尔类型（boolean）、空类型（null）和未定义类型（undefined），其中，number,string,boolean 的值可以通过程序员或者位于幕后的 JavaScript 解析器来实现向对象的转换。

对象主要有两种类型：1）原生的——ECMAScript标准中描述；2）主机的——在主机环境中定义

原生的对象可以进一步分为：内置对象（如数组、日期对象等）和用户自定义对象（如 var o = {} 等)

主机对象包含 windows 对象和所有的 DOM 对象。

##### 没有类

一个“空对象”实际上并不是完全空白的，它实际上是包含有一些内置的属性，但是没有其自身的属性。

"Gang of Four"书中的一条通用规则：尽量多使用对象的组合，而不是使用类的继承。——>通过已有的对象组合来获取新对象，是比通过很长的父-子继承链来创建新的对象更好的一种方法。

### <p style="background:orange;">第3章：字面量和构造函数</p>

**创建对象的三种方式：**

	// 对象字面量
	var car = {goes: "far"};

	// 内置构造函数
	var car = new Object();
	car.goes = "far";

	// 自定义构造函数
	var adam = new Person("Adam");
	adam.say();

**对象字面量的优点：**

- 按需创建对象，在程序生命周期内的任何时候都可以修改；
- 输入更短的字符；
- 强调该对象仅是一个可变哈希映射，而不是从对象中提取的属性和方法；
- 没有作用域解析

**构造函数的特征（使用缺点）：**

- 依赖传递的参数的值，该构造函数可能会委派另一个内置构造函数来创建对象，并且返回了一个并非期望的不同对象
- 当传递给构造函数的值是动态的，并且直到运行时才能确定其类型
	
		// 一个空对象
		var o = new Object();
		console.log(o.constructor === Object);  // true
		
		// 一个数值对象
		var o = new Object(1);
		console.log(o.constructor === Number);  // true
		console.log(o.toFixed(2));  // '1.00'	

JavaScript 中没有类的概念，但是它却支持极大的灵活性，因为不必预先知道对象的一切细节，也不需要类“蓝图”。

	// 构造函数的定义
	var Person = function(name) {
	  this.name = name;
	  this.say = function() {
	    return "I am " + this.name;
	  };
	};

当 new 操作符调用构造函数时，相当于在后台发生了如下事情：

	var Person = function(name) {
	
	  // 使用对象字面量模式创建一个对象
	  // var this = {};
	
	  // 向 this 添加属性和方法
	  this.name = name;
	  this.say = function() {
	    return "I am" + this.name;
	  };
	
	  // return this;
	}

**构造函数的返回值：**

- 当用 `new` 操作符创建对象时，构造函数总是返回一个对象；
- 默认返回 `this` 所引用的对象，也可以返回任意其他对象；
- 如果试图返回并非对象的值，函数会忽略该值，并返回 `this` 所引用的对象。

> 如果在调用构造函数时，忘记使用 `new` 操作符，会导致构造函数中的 `this` 指向全局对象。

**自调用构造函数**——解决忘记使用 `new` 的问题，同时还能使实例继承原型

	// 自调用构造函数
	function Waffle() {
	
	  if ( !(this instanceof Waffle) ) {
	    return new Waffle;
	  }
	
	  this.tastes = "yummy";
	
	}
	
	Waffle.prototype.wantAnother = true;
	
	// 测试调用
	var first = new Waffle(),
	    second = Waffle();
	
	console.log(first.tastes);  // "yummy";
	console.log(second.tastes);  // "yummy";
	console.log(first.wantAnother);   // "true";
	console.log(second.wantAnother);   // "true";

另一种检测实例对象的方法：

	if ( !(this instanceof arguments.callee) ) {
	return new arguments.callee();
	} 


##### 检测是否为数组：

`Array.isArray()`

	function polyfillArray(arr) {
	
	  if (typeof Array.isArray === 'undefined') {
	    Array.isArray = function(arg) {
	      return Object.prototype.toString.call(arg) === "[object Array]";
	    };
	  }
	
	  return Array.isArray(arr);
	}
	
	polyfillArray([]);  // 'true'
	
	polyfillArray({
	  length: 1,
	  "0": 1,
	  slice: function () {}
	}); // false


### <p style="background:orange;">第四章 函数</p>

##### 一、JavaScript 中函数的两个重要特征：

1. 函数是第一类<span style="color: red">对象</span>，可以作为带有属性和方法的值以及参数进行传递；
2. 函数提供了<span style="color: red">局部作用域</span>，而其他大括号并不能提供这种局部作用域。此外，声明的局部变量可被提升到局部作用域的顶部。

##### 二、创建函数的语法包括：

1. 命名函数表达式（函数表达式的一种特殊情况）；

		var add = function add(a,b) {
			return a + b;
		};	// <—— 分号结尾

2. 函数表达式，即匿名函数；

		// 该函数对象的 name 属性将会成为一个空字符串
		var add = function (a,b) {
			return a + b;
		};	// <—— 分号结尾

3. 函数声明，与其他语言中的函数的语法类似。

		function foo() { 
			// 函数主体 
		}

> 注意，`函数字面量` 是指函数表达式或命名函数表达式，但不建议使用。

##### 差别：

<span style="color:#ac4a4a">1）语法差异：</span>

- 函数声明不需要分号结尾；
- 函数表达式需要。

<span style="color:#ac4a4a">2）用法差异：</span>

- 函数表达式应用场景：将函数对象作为参数传递，或者在对象字面量中定义方法。

		// 1. 作为参数传递
		callMe(function () {
		  // 函数表达式（匿名函数）
		})
		
		callMe(function me() {
		  // 命名函数表达式
		})
		
		// 2. 在对象字面量中定义方法
		var myObject = {
		  say: function() {
		    // 函数表达式
		  }
		}

- 函数声明只能出现在“程序代码”中，即仅能在其他函数体内部或全局空间中。其定义不能分配给变量或属性，也不能以参数形式出现在函数调用中。

		// 1.全局作用域
		function foo() {
		  // 2.局部作用域
		  function bar() {}
		  return bar;
		}

<span style="color:#ac4a4a">3）函数的提升：</span>

- 对于所有变量，无论在函数体的何处进行声明，都会在后台被提升到函数顶部。
- 当使用函数声明时，函数定义和函数声明都被提升。

		function hoistMe() {
		  console.log(typeof foo); // 'function'
		  console.log(typeof bar);  // 'undefined'
		
		  foo();  // 'local foo'
		  bar();  // 'TypeError: bar is not a function'
		
		  /*
		   * 函数声明
		   * 变量 'foo' 及其实现都被提升
		   */
		  function foo() {
		    console.log('local foo');
		  }
		
		  /*
		   * 函数表达式
		   * 仅变量 'bar' 被提升，函数实现并未被提升
		   */
		  var bar = function() {
		    console.log('local bar');
		  }
		}

##### 三、函数的模式：

##### 1.&nbsp;`API 模式`——>可以为函数提供更好且更整洁的接口。

- **回调模式**：将函数作为参数进行传递；

> 注意点：回调与作用域，当回调作为一个对象的方法时，调用回调 this 会发生变化
> 
> 使用场景：异步事件监听器、超时方法、库中的回调模式（有助于扩展及自定义库方法）。

- **配置对象**：有助于保持收到控制的函数的参数数量；

> 缺点：需要记住参数名称；属性名称无法被压缩
> 
> 应用：当函数创建DOM元素时，该模式非常有用，如，可用于设置元素的CSS样式。

- **返回函数**：当一个函数的返回值是另一个函数时；

> 闭包

- **Curry 化**：是一个转化过程，即我们执行函数转换的过程。当新函数是基于现有函数，并加上部分参数列表创建时。

> 函数应用：在一些纯粹的函数式编程语言中，函数并不描述为被调用，而是描述为应用。
> 
> 函数调用：实际上就是将一个参数集合应用到一个函数中。
> 
> Curry过程：使函数理解并处理部分应用的过程。

##### 2.&nbsp;`初始化模式`——>可以在不污染全局命名空间的情况下，使用临时变量以一种更加整洁、结构化的方式初始化以及设置任务。

- **即时函数**：只要定义之后就立即执行；

- **即时对象初始化**：匿名对象组织了初始化任务，提供了可被立即调用的方法；

> 缺点：不利于压缩

- **初始化时分支（加载时分支）**：是一种优化模式，帮助分支代码在初始化代码执行过程中仅检测一次，这与以后在程序生命期内多次检测相反。

##### 3.&nbsp;`性能模式`——>可以加速代码运行

- **备忘模式**：使用函数属性以便使得计算过的值无须再次计算；

> 默认：length 属性，包含了该函数期望的参数数量
> 
> 自定义属性：缓存函数结果（备忘）

- **自定义模式**：以新的主体重写本身，以使得在第二次或以后调用时仅需执行更少的工作；

> 缺点：
>
> 当它重定义自身时已经添加到原始函数的任何属性都会丢失；
>
> 此外，如果函数使用了不同的名称，比如分配给不同的变量或者以对象的方法来使用，那么重定义部分将永远不会发生，并且将会执行原始函数体

### <p style="background:orange;">第五章 对象创建模式</p>

JavaScript 是一种简洁明了的语言，并没有其他语言中经常使用的一些特殊语法特征，如	`命名空间`、`模块`、`包`、`私有属性` 以及 `静态成员` 等语法。

但是通过常见的模式，可以实现、替换其他语言中的语法特征。

##### 1. 命名空间模式

	// 全局变量
	var MYAPP = {};
	
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

<span style="color:red">优点：</span>有助于减少程序中所需要的全局变量的数量，并且同时还有助于避免冲突或过长的名字前缀。

<span style="color:red">缺点：</span>

- 需要输入更多的字符，变量加前缀，增加代码量；
- 仅有一个全局实例，任意部分的代码都可以修改它；
- 长嵌套名字，更长的属性解析查询时间。

<span style="color:red">解决方案：</span>沙箱模式

##### 2. 声明依赖模式

	var myFunction = function() {
	  // 依赖
	  var event = YAHOO.util.Event,
	      dom = YAHOO.util.Dom;
	
	  // 使用事件和DOM变量
	  // 下面的函数...
	}

<span style="color:red">优点：</span>

- 显示的依赖声明表明了特定脚本文件已经包含在该页面中；
- 在函数顶部的前期声明可以很容易发现并解析依赖；
- 解析局部变量的速度总是要比解析全局变量（或全局变量的嵌套属性）快，提升性能；
- 利用工具可以重命名局部变量，会生成更小的代码量。

##### 3. 私有模式

JavaScript 中所有对象的成员是公共的。

`私有成员`：利用 `闭包` 实现。

`特权方法`：指可以访问私有成员的公共方法，因为它具有访问私有属性的“特殊”权限。

`私有性失效`：从特权方法中返回一个私有变量，且该变量恰好是一个*对象或者数组*，那么外面的代码仍然可以访问该私有变量，因为它通过引用传递。

###### 1）使用构造函数获得私有性	

	/**
	 * 利用闭包实现私有成员
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
	
	console.log(toy.name); // 'undefined'
	console.log(toy.getName());  // 'iPod'
	
	var newColor = toy.getColor();
	newColor[0] = 'black';
	console.log(toy.getColor());  // 'black'

> 缺点：当将私有成员与构造函数一起使用时，每次调用构造函数以创建对象时，这些私有成员都会被重新创建。
>
> 解决方案：使用原型共享常用属性和方法，另外，还可以在多个实例中共享隐藏的实例成员。    

###### 2）模块模式的基础框架：对象字面量以及私有性

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

###### 3）原型和私有性

<span style="color:red">优点</span>：解决构造函数获得私有性的缺点。

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

###### 4）将私有方法揭示为公共方法

`揭示模式` 可用于将私有方法暴露成公共方法。

<span style="color:red">优点</span>：当为了对象的运转而将所有功能放置在一个对象中以及想尽可能地保护该对象是至关重要的时候，这种`揭示模式`就显得非常有用。

<span style="color:red">缺点</span>：将这又私有方法暴露为公共方法时，也使它们变得更为脆弱。

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
	
	  myarray = {	// 填充了认为适于公共访问的功能
	    isArray: isArray,
	    indexOf: indexOf,	// 如果公共indexOf方法发生意外，私有indexOf方法仍然是安全的
		inArray: indexOf	// inArray()将继续正常运行
	  };
	}());

##### 4. 模块模式

- JavaScript 并没有包的特殊语法，但是模块模式提供了一种创建自包含非耦合代码片段的有利工具，可以将它视为黑盒功能，并可以根据需求添加、替换或删除这些模块。

- 模块模式是多种模式的组合：命名空间、即时函数、私有和特权成员、声明依赖。

<span style="color:red">优点</span>：提供了结构化的思想并有助于组织日益增长的代码。

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

###### 揭示模块模式

> ——其中所有的方法都需要保持私有性，并且只能暴露那些最后决定设立API的那些方法


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

###### 创建构造函数的模块

> 与使用模式模式来执行创建对象的操作的区别：包装了模块的即时函数最终会返回一个函数，而不是返回一个对象。

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

###### 将全局变量导入到模块中

> 导入全局变量有助于加速即时函数中的全局符号解析的速度，因为这些导入的变量成为了该函数的局部变量。

	MYAPP.utilities.module = (function(app, global) {
	
	  // 引用全局变量
	  // 以及现在被转换成局部变量的
	  // 全局应用程序命名空间对象
	
	}(MYAPP, this));

##### 5. 沙箱模式

<span style="color:red">优点：</span>解决命名空间模式的缺点。提供了一个可用于模块运行的环境，且不会对其他模块和个人沙箱造成任何影响。

---

`静态属性和方法`：指那些从一个实例到另一个实例都不会发生改变的属性和方法。

`公有静态成员`的实现：使用构造函数并向其添加属性。

`私有静态成员`：1）以同一个构造函数创建的所有对象共享该成员；2）构造函数外部不可访问该成员。

`对象常量`：JavaScript 使用命名规定。

##### 8. 链模式

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

<span style="color:red">优点：</span>节省一些输入的字符，代码更简洁，可维护性高。

<span style="color:red">缺点：</span>更加难以调试。

##### 9. method() 方法——语法糖

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


### <p style="background:orange;">第六章 代码复用模式</p>

> GoF 在其著作中提出的有关创建对象的建议原则：
> 
> —— 优先使用对象组合，而不是类继承。

- 传统模式：使用类继承；
- 现代模式：“类式继承”，不以类的方式考虑。

代码重用才是最终目的，继承只是实现这一目标的方法之一。

##### 使用类式继承时的预期结果
	
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

##### 类式继承#1——默认模式

	function inherit(C, P) {
	  C.prototype = new P();
	}
	
	var kid = new Child();
	kid.say();  // 'Adam'

<span style="color:red">缺点：</span>1）同时继承了两个对象的属性，即添加到 `this` 的属性以及原型属性。2）不支持参数传递。

##### 类式继承#2——借用构造函数

	function Child(name) {
	  Parent.apply(this, arguments);
	}
	
	var kid = new Chlid('Patrick');
	kid.name; // 'Patrick'
	typeof kid.say; // 'undefined'

<span style="color:red">优点：</span>解决了从子构造函数到父构造函数的参数传递问题，可获得父对象自身成员的真实副本。

<span style="color:red">缺点：</span>无法从原型中继承任何东西，并且原型也仅是添加可重用方法及属性的位置，它并不会为每个实例重新创建原型。

##### 类式继承#3——借用和设置原型

> 主要思想：结合前两种模式，先借用构造函数，然后设置子构造函数的原型使其指向一个构造函数创建的新实例。
	
	function Chlid(name) {
	  Parent.apply(this, arguments);
	}
	
	Child.prototype = new Parent(); // 第一次调用
	
	var kid = new Chlid('Patrick'); // 第二次调用
	kid.name; // 'Patrick'
	kid.say();  // 'Patrick'
	delete kid.name;
	kid.say();  // 'Adam'

<span style="color:red">缺点：</span>需要两次调用父构造函数。

##### 类式继承#4——共享原型

> 经验法则：可复用成员应该转移到原型中而不是放置在 this 中。

	function inherit(C, P) {
	  C.prototype = P.ptototype;
	}

<span style="color:red">优点：</span>不需要两次调用父构造函数。

<span style="color:red">缺点：</span>如果在继承链下方的某处存在一个子对象或者孙子对象修改了原型，它将会影响到所有的父对象和祖先对象。

##### 类式继承#5——临时构造函数（代理函数或代理构造函数模式）

> 通过断开父对象与子对象的原型之间的直接链接关系，从而解决共享同一个原型所带来的问题，同时还能够继续受益于原型链带来的好处。

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


##### Klass

##### 原型继承

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

##### 通过复制属性实现继承

由于 JavaScript 中的对象时通过引用传递的，在使用 `浅复制` 的时候，如果改变了子对象的属性，并且该属性恰好是一个对象，那么这种操作表示也正在修改父对象。

使用 `深复制` 可以创建对象的真是副本。jQuery库中的 `extend()` 可创建深度复制的副本。

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

##### 混入——针对通过属性复制实现继承的思想做的进一步扩展

mix-in 模式并不是复制一个完整的对象，而是从多个对象中复制出任意的成员并将这些成员组合成一个新的对象。

实现：遍历每个参数，并复制出传递给该函数的每个对象中的每个属性。

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

##### 借用方法

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