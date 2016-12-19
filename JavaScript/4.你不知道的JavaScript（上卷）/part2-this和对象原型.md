### <p style="background:orange;">第1章 关于this</p>

`this` 是自动定义在所有函数的作用域中的关键字，用于引用合适的*上下文对象*。

##### ☞ 为什么要使用 `this` ？

- `this` 提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将API设计得更加简洁并且易于复用。

##### ☞ 对 `this` 的误解

- `this` 不指向函数自身，也不指向函数的词法作用域。

	- 作用域“对象”无法通过JavaScript代码访问，存在于JavaScript引擎内部

##### ☞ `this` 到底是什么

- `this` 是在函数被调用时发生的绑定，和函数声明的位置没有关系，它的上下文（指向）取决于函数调用时的各种条件。
- 当一个函数被调用时，会创建一个活动记录（执行上下文）。
	- 这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。`this` 就是记录的其中一个属性，会在函数执行的过程中用到。

### <p style="background:orange;">第2章 this全面解析</p>

##### <p style="background: #cfc9fa">☞ 调用位置（调用方法）

`调用栈`：为了到达当前执行位置所调用的所有函数，类似于函数调用链。

调用位置就是在当前执行的函数的前一个调用中。

	function baz() {
	  // 当前调用栈是：baz
	  // 因此，当前调用位置是全局作用域
	
	  console.log('baz');
	  bar();  // <-- bar 的调用位置
	}
	
	function bar() {
	  // 当前调用栈是：baz -> bar
	  // 因此，当前调用位置在 baz 中
	
	  console.log('bar');
	}
	
	baz();  // <-- baz 的调用位置

##### <p style="background: #cfc9fa">☞ 绑定规则

###### ① 默认绑定：独立函数调用，`this` 指向全局对象

		function foo() {
		  console.log(this.a);
		}
		
		var a = 2;
		foo();  // 2

> 严格模式下，全局对象将无法使用默认绑定，`this` 会绑定到 `undefined`

###### ② 隐式绑定：考虑调用位置是否有上下文对象

		function foo() {
		  console.log(this.a);
		}
		
		/**
		 * 无论是直接在 obj 中定义还是先定义再添加引用属性，foo() 严格来说都不属于 obj 对象
		 */
		var obj2 = {
		  a: 42,
		  foo: foo	// 当做 obj 的引用属性添加
		};
		
		var obj1 = {
		  a: 2,
		  obj2: obj2
		}
		
		/**
		 * 对象属性引用链中只有最顶层或者说最后一层会影响调用位置。
		 * 调用位置使用 obj2 的上下文来引用函数
		 */
		obj1.obj2.foo();  // 42

> 当函数有上下文对象时，`隐式绑定` 规则会把函数调用中的 `this` 绑定到这个上下文对象。

<span style="color:red">*※ 隐式丢失*</span>：被 `隐式绑定` 的函数会丢失绑定对象，即会应用 `默认绑定`。

[例1：]

	function foo() {
	  console.log(this.a);
	}
	
	var obj = {
	  a: 2,
	  foo: foo
	};
	
	var bar = obj.foo;  // 函数别名！
	var a = "oops, global"; // a是全局对象的属性
	bar();  // 'oops, global'

[例2：*传入回调函数* ]

	function foo() {
	  console.log(this.a);
	}
	
	// 参数传递其实就是一种隐式赋值
	function doFoo(fn) {
	  // fn 其实引用的是 foo
	
	  fn(); // <-- 调用位置！
	}
	
	var obj = {
	  a: 2,
	  foo: foo
	};
	
	var a = "oops, global"; // a是全局对象属性
	
	doFoo(obj.foo); // 'oops, global'

	// 传入语言内置的函数
	setTimeout(obj.foo, 2000); // 'oops, global'

JavaScript 环境中内置的 setTimeout() 函数实现和下面的伪代码类似：

	function setTimeout(fn, delay) {
	  // 等待 delay 毫秒
	  fn(); // <-- 调用位置
	}

> 调用回调函数的函数可能会修改 this。
>
> 在一些流行的 JavaScript 库中事件处理器常会把回调函数的 `this` 强制绑定到触发事件的 DOM 元素上。
> 
> 实际上，你无法控制回调函数的执行方式，因此就没有办法控制会影响绑定的调用位置。

###### ③ 显式绑定：call()、apply()

<span style="color:red">1) *硬绑定*</span> ：显式绑定的一个变种，解决丢失绑定问题

	function foo() {
	  console.log(this.a);
	}
	
	var obj = {
	  a: 2
	};
	
	var a = 3;
	
	/**
	 * 显式绑定
	 * 仍然存在丢失绑定问题
	 */
	foo.call(obj);  // 2
	foo.call(null); // 3
	
	/**
	 * 硬绑定：显式的强制绑定
	 * 解决丢失绑定问题
	 */
	var bar = function() {
	  foo.call(obj);
	};
	
	bar();  // 2
	setTimeout(bar, 100); // 2
	
	// 硬绑定的 bar 不可能再修改它的 this
	bar.call(window); // 2

[ *硬绑定的典型应用场景* ]：创建一个包裹函数，传入所有的参数并返回接收到的所有值。

	function foo(something) {
	  console.log(this.a, something);
	  return this.a + something;
	}
	
	var obj = {
	  a: 2
	};
	
	var bar = function() {
	  return foo.apply(obj, arguments);
	};
	
	var b = bar(3); // 2 3
	console.log(b); // 5

[ *硬绑定的应用场景2* ]：创建一个 `i` 可重复使用的辅助函数（bind实现及内置函数）

	function foo(something) {
	  console.log(this.a, something);
	  return this.a + something;
	}
	
	/**
	 * 简单的辅助绑定函数：
	 * 返回一个硬编码的新函数，把参数设置为 this 的上下文并调用原始函数
	 */
	function bind(fn, obj) {
	  return function() {
	    return fn.apply(obj, arguments);
	  }
	}
	
	var obj = {
	  a: 2
	};
	
	var bar = bind(foo, obj);
	
	var b = bar(3); // 2 3
	console.log(b); // 5
	
	/**
	 * 硬绑定模式内置方法：
	 * Function.prototype.bind
	 */
	var bar2 = foo.bind(obj);
	
	var b2 = bar(4);  // 2 4
	console.log(b2); // 6

<span style="color:red">2) *API调用的“上下文”*</span> ：提供“上下文”的可选参数，确保回调函数使用指定的 `this`
	
	function foo(el) {
	  console.log(el, this.id);
	}
	
	var obj = {
	  id: 'awesome'
	};
	
	// 调用foo(...)时把 this 绑定到 obj
	[1,2,3].forEach(foo, obj);  // 1 "awesome" 2 "awesome" 3 "awesome"

###### ④ `new` 绑定

在 JavaScript 中，构造函数只是有些使用 `new` 操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。

使用 `new` 来调用函数时，会自动执行下面的操作：
	
> 1）创建（或者说构造）一个全新的对象；
>
> 2）这个新对象会被执行[[原型]]连接；
>
> 3）这个新对象会绑定到函数调用的 `this`；
>
> 4）如果函数没有返回其他对象，那么 `new` 表达式中的函数调用会自动返回这个新对象。

##### <p style="background: #cfc9fa">☞ 优先级/判断 `this`

1. 由 `new` 调用？——> 绑定到新创建的对象。
2. 由 `call` 或 `apply`（或者 `bind`）调用？——> 绑定到指定的对象。
3. 由上下文对象调用？——> 绑定到那个上下文对象。
4. 默认——> 在严格模式下绑定到 `undefined`，否则绑定到全局对象。

[*例子*]:

	function foo(p1, p2) {
	  this.val = p1 + p2;
	}
	
	// 是所以使用 null 是因为在本例中我们并不关心硬绑定的 this 是什么
	// 反正使用 new 时 this 会被修改
	var bar = foo.bind(null, 'p1');
	
	var baz = new bar('p2');
	
	console.log(baz.val); // p1p2

> 在 `new` 中使用硬绑定函数，主要目的是预先设置函数的一些参数，这样在使用 `new` 进行初始化时就可以只传入其余的参数。
>
> bind(...)的功能之一就是可以把第一个参数（第一个参数用于绑定 this）之外的其他参数都传给下层的函数（这种技术成为“部分应用”，是“柯里化”的一种）。

##### <p style="background: #cfc9fa">☞ 绑定例外

###### ① 被忽略的 `this`

如果你把 `null` 或者 `undefined` 作为 `this` 的绑定对象传入 `call`、`apply` 或者 `bind`，这些值在调用时会被忽略，实际应用的是默认绑定规则。

- 传入 `null` 的情况：

	- 使用 `apply(...)` 来“展开”一个数组，并当做参数传入一个函数。
	- bind(...)可以对参数进行柯里化（预先设置一些参数）。

			function foo(a, b) {
			  console.log("a:" + a + ", b:" + b);
			}
			
			// 把数组“展开”成参数
			foo.apply(null, [2, 3]); // a:2, b:3
			
			// 在ES6中，可以用...操作符代替apply(...)来“展开”数组
			foo(...[1,2]);  // a:1, b:2
			
			// 使用 bind(...) 进行柯里化
			var bar = foo.bind(null, 3);
			bar(4); // a:3, b:4

- 更安全的 `this`：

	- 创建一个空的非委托的对象（`Object.create(null)`）

			function foo(a, b) {
			  console.log("a:" + a + ", b:" + b);
			}
			
			// 创建DMZ（demilitarized zone,非军事区）空对象
			var dmzObj = Object.create(null);
			
			// 把数组“展开”成参数
			foo.apply(dmzObj, [2, 3]); // a:2, b:3
			
			// 使用 bind(...) 进行柯里化
			var bar = foo.bind(dmzObj, 3);
			bar(4); // a:3, b:4

> `Object.create(null)` 和 `{}` 很像，但是并不会创建 `Object.prototype` 这个委托，所以它比 {} “更空”。

###### ② 间接引用 —— 函数会应用默认绑定规则。

[ *“间接引用”最容易在赋值时发生* ]：

	function foo() {
	    console.log(this.a);
	}
	
	var a = 2;
	var o = {a: 3, foo: foo};
	var p = {a: 4};
	
	o.foo();  // 3
	
	/**
	 * 该赋值表达式的返回值是目标函数的引用
	 * 因此调用位置是 foo() 而不是 p.foo() 或者 o.foo()
	 */
	(p.foo = o.foo)();  // 2

###### ③ 软绑定

<span style="background:yellow">硬绑定的优点</span>：会把 `this` 强制绑定到指定的对象，防止函数调用应用默认绑定规则。

<span style="background:yellow">硬绑定的缺点</span>：会大大降低函数的灵活性，使用之后就无法使用隐式绑定或者显示绑定来修改 `this`。

<span style="color:red">软绑定</span>：可以给默认绑定指定一个全局对象和 `undefined` 以外的值（同硬绑定），同时保留隐式绑定或者显式绑定修改 `this` 的能力。

	if (!Function.prototype.softBind) {
	    Function.prototype.softBind = function(obj) {
	        var fn = this;
	        // 捕获所有 curried 参数
	        var curried = [].slice.call(arguments, 1);
	        var bound = function() {
	            return fn.apply(
	                (!this || this === (window || global)) ?
	                    obj : this,
	                curried.concat.apply(curried, arguments)
	            );
	        };
	        bound.prototype = Object.create(fn.prototype);
	        return bound;
	    }
	}
	
	function foo() {
	    console.log("name:" + this.name);
	}
	
	var obj = { name: 'obj' },
	    obj2 = { name: 'obj2' },
	    obj3 = { name: 'obj3' };
	
	/**
	 * 软绑定
	 */
	var fooOBJ = foo.softBind(obj);
	
	fooOBJ();   // name: obj
	
	obj2.foo = foo.softBind(obj);
	obj2.foo(); // name: obj2   <---- 看！！！
	
	fooOBJ.call(obj3);  // name: obj3   <---- 看！
	
	setTimeout(obj2.foo, 10);   // name: obj    <---- 应用了软绑定
	
	/**
	 * 硬绑定
	 */
	obj3.foo = foo.bind(obj3);
	obj3.foo(); // name: obj3 
	setTimeout(obj3.foo, 10);   // name: obj3

##### <p style="background: #cfc9fa">☞ `this` 词法 ——> 箭头函数

`箭头函数` 不使用 `this` 的四种标准规则，而是根据外层（函数或者全局）作用域来决定 `this`。

[ *箭头函数的词法作用域* ]：

	function foo() {
	    // 返回一个箭头函数
	    return (a) => {
	        // this 继承自 foo()
	        console.log(this.a);
	    };
	}
	
	var obj1 = {
	    a: 2
	};
	
	var obj2 = {
	    a: 3
	};
	
	var bar = foo.call(obj1);
	bar.call(obj2); // 2，不是3！箭头函数的绑定无法被修改！

[ *箭头函数最常用于回调函数中* ]：

	function foo() {
	    setTimeout(() => {
	        // 这里的 this 在此法上继承自 foo()
	        console.log(this.a);
	    }, 100);
	}
	
	var obj = {
	    a: 2
	};
	
	foo.call(obj);  // 2

> 箭头函数可以像 `bind(...)` 一样确保函数的 `this` 被绑定到指定对象，此外，其重要性还体现在它用更常见的词法作用域取代了传统的 `this` 机制。

### <p style="background:orange;">第3章 对象</p>

##### ☞ 类型

- 5 种简单基本类型（本身并不是对象）：`string`、`number`、`boolean`、`null`、`undefined`

- 1 种复杂基本类型：对象子类型

- 内置对象：`String`、`Number`、`Boolean`、`Object`、`Function`、`Array`、`Date`、`RegExp`、`Error`

-  JavaScript 中的函数是“一等公民”，因为它们本质上和普通的对象一样（只是可以调用），所以可以像操作其他对象一样操作函数。

- `null` 和 `undefined` 没有对应的构造形式，它们只有文字形式。相反，`Date` 只有构造，没有文字形式。

对于 `Object`、`Array`、`Function`、`RegExp` 来说，无论使用文字形式还是构造形式，它们都是对象，不是字面量。

❶ `null` 是基本类型，但是 `typeof null` 返回的是 `object`，原理如下：不同的对象在底层都表示为二进制，在 JavaScript 中前三位都为 0 的话会被判断为 `object` 类型，`null` 的二进制表示全是 0，自然前三位也是 0，所以执行 `typeof` 时会返回 `object`。

##### ☞ 内容

- 从技术角度来说，函数永远不会“属于”一个对象，只是对于同一个函数的不同引用。

- 数组也是对象，虽然每个下标都是整数，但仍然可以给数组添加属性。但是，如果试图像数组添加一个“看起来”像数字的属性，则它会变成一个数值下标。

		var myArray = ["foo", 42, "bar"];
		myArray["3"] = "baz";
		
		console.log(myArray.length); // 4
		console.log(myArray[3]); // "baz"

- 复制对象：浅复制&深复制
	- ES6 定义了 <span style="color:red">`Object.assign(...)`</span> 方法：实现浅复制

			function anotherFunction() {}
			
			var anotherObject = {
			  c: true
			};
			
			var anotherArray = [];
			
			var myObject = {
			  a: 2,
			  b: anotherObject, // 引用，不是复本！
			  c: anotherArray,  // 另一个引用
			  d: anotherFunction
			};
			
			var newObj = Object.assign({}, myObject);
			
			console.log(newObj.a); // 2
			console.log(newObj.b === anotherObject);  // true
			console.log(newObj.c === anotherArray); // true
			console.log(newObj.d === anotherFunction);  // true

- 属性描述符（数据描述符）：
	- <span style="color:red">`Object.getOwnPropertyDescriptor()`</span>：检测属性特性
	- <span style="color:red">`Object.defineProperty(...)`</span>：添加或修改属性，从而对特性进行设置

			var myObject = {
			  a: 2
			};
			
			Object.getOwnPropertyDescriptor(myObject, 'a');
			// {
			//   value: 2,
			//   writable: true,	// 决定是否可以修改属性的值
			//   enumerable: true,	// 控制属性是否会出现在对象的属性枚举中，比如for...in循环
			//   configurable: true	// 只要属性是可配置的，就可以使用 defineProperty(...)方法来修改属性描述符
			// }
			
			Object.defineProperty(myObject, 'a', {
			  value: 3,
			  writable: true,
			  configurable: true,
			  enumerable: true
			});
			
			myObject.a; // 3

- 不变性：
	- 对象常量：<span style="color:red">`writable:false`</span> + <span style="color:red">`configurable:false`</span>
	- 禁止扩展：<span style="color:red">`Object.preventExtensions(...)`</span>
	- 密封：<span style="color:red">`Object.seal(...)`</span>
	- 冻结：<span style="color:red">`Object.freeze(...)`</span>

- `Getter` 和 `Setter`：

		var myObject = {
		  // 给a定义一个 getter
		  get a() {
		    return this._a_;
		  },
		
		  // 给a定义一个setter
		  set a(val) {
		    this._a_ = val * 2;
		  }
		
		};
		
		console.log(myObject);
		
		Object.defineProperty(
		  myObject, // 目标对象
		  'b',  // 属性名
		  { // 描述符
		    // 给b设置一个 getter
		    get: function() { return this.a * 2; },
		
		    // 确保b会出现在对象的属性列表中
		    enumerable: true
		  }
		);
		
		myObject.a = 2;
		
		console.log(myObject.a);  // 4
		console.log(myObject.b);  // 8

- 存在性
	- <span style="color:red">`in`</span>：对象上所有属性
	- <span style="color:red">`hasOwnProperty()`</span>：所有实例属性
	- <span style="color:red">`Object.keys()`</span>：对象上所有可枚举属性
	- <span style="color:red">`Object.getOwnPropertyNames()`</span>：所有实例属性
	- `for...in` 循环会枚举所有可枚举属性
	- 最好只在对象上应用 `for...in` 循环，如果要遍历数组就使用传统的 `for循环` 来遍历数值索引。

- 遍历
	- <span style="color:red">`for...in`</span>：遍历对象的可枚举属性，但是不保证顺序
	- <span style="color:red">`for...of`</span>：直接遍历属性值，ES6新增

			var myArray = [1, 2, 3];
			
			for (var v of myArray) {
			  console.log(v);
			}
			// 1
			// 2
			// 3
> `for...of` 循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的 `next()` 方法来遍历所有返回值。
> 
> 数组有内置的 @@iterator，因此 `for...of` 可以直接应用在数组上。
> 
> 普通的对象没有内置的 @@iterator，所以无法自动完成 `for...of` 遍历，但是可以给任何想遍历的对象自定义 @@iterator

[*使用内置的 @@iterator 手动遍历数组* ]：

	var myArray = [1, 2, 3];
	
	// 使用 Symbol.iterator 来获取对象的 @@iterator 内部属性
	// @@iterator 本身并不是一个迭代器对象，而是一个返回迭代器对象的属性
	var it = myArray[Symbol.iterator]();
	
	it.next();  // { value: 1, done: false }
	it.next();  // { value: 1, done: false }
	it.next();  // { value: 1, done: false }
	it.next();  // { value: undefined, done: true }

### <p style="background:orange;">第4章 混合对象“类”</p>

##### ☞ 类理论

- 类是一种设计模式，所以你可以用一些方法近似实现类的功能。
- 许多语言提供了对于面向类软件设计的原生语法。JavaScript也有类似的语法，但是和其他语言中的类完全不同。
- 在软件设计中类是一种可选的模式，你需要自己决定是否在 JavaScript 中使用它。

##### ☞ 类的机制

- 一个类是一张蓝图，对象是类中描述的所有特性的一个<span style="color:red">副本</span>。类通过<span style="background:yellow">复制</span>操作被实例化为对象形式。

##### ☞ 类的继承

- 子类会包含父类行为的原始副本，但是也可以重写所有继承的行为甚至新行为。
- 多态
	- 任何方法都可以引用继承层次中高层的方法；
	- 在继承链的不同层次中的一个方法名可以被多次定义，当调用方法时会自动选择合适的定义。
- 多重继承：意味着所有父类的定义都会被复制到子类中。
- JavaScript 本身不提供“多重继承”功能。

##### ☞ 混入：模拟类的复制行为

- 在继承或实例化时，JavaScript 的对象机制并不会自动执行复制行为。

- JavaScript 中只有对象，并不存在可以被实例化的“类”。一个对象并不会被复制到其他对象，它们会被<span style="background:yellow">关联起来</span>。

- 混入模式可以用来模拟类的复制行为，但是通常会产生丑陋并且脆弱的语法，比如显式伪多态（OtherObje.methodName.call(this, ...)），这会让代码更加难懂且难以维护。

- 此外，显式混入实际上无法完全模拟类的复制行为，因为对象只能复制引用，无法复制被引用的对象或者函数本身！

> 总的来说，在 JavaScript 中模拟类是得不偿失的，虽然能解决当前的问题，但是可能会埋下更多的隐患。

### <p style="background:orange;">第5章 原型</p>

##### ☞ “类”

- JavaScript 中的“类似类”的行为利用了函数的一种特殊特性：所有的函数默认都会拥有一个名为 `prototype` 的公有且不可枚举的属性，它会指向另一个对象。
- 在 JavaScript 中，并没有类似的复制机制。你不能创建一个类的多个实例，只能创建多个对象，它们	`[[Prototype]]` 关联的是同一个对象。

		function Foo() { //... };

		// Foo 的原型
		Foo.prototype;	// Object {}
	
		// 创建 a，并给 a 一个内部的 [[Prototype]] 链接，关联到 Foo.prototype 指向的那个对象
		var a = new Foo();

		Object.getPrototypeOf( a ) === Foo.prototype;	// true

- 秘密：
	- `new Foo()` 这个函数调用实际上并没有直接创建关联，这个关联只是一个意外的副作用。`new Foo()` 只是间接完成了我们的目标：一个关联到其他对象的新对象。
	- 更直接的方法：<span style="color:red">`Object.create(..)`</span>

- 继承意味着复制操作，JavaScript（默认）并不会复制对象属性。相反，JavaScript 会在两个对象之间创建一个关联，这样一个对象就可以通过<span style="background:yellow">委托</span>访问另一个对象的属性和函数。

	<img src="https://github.com/RukiQ/blog-learning-patch/blob/master/%E3%80%8A%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84JavaScript%E3%80%8B/img/%E7%B1%BB%E6%9C%BA%E5%88%B6%E5%92%8C%E5%8E%9F%E5%9E%8B%E6%9C%BA%E5%88%B6%E5%AF%B9%E6%AF%94.jpg?raw=true" alt="类的继承和原型继承对比" width=500>

##### ☞ （原型）继承

- 调用 <span style="color:red">`Object.create(..)`</span> 会凭空创建一个“新”对象并把新对象内部的 `[[Prototype]]` 关联到你指定的对象。
- <span style="background:yellow">优点</span>：可以充分发挥 `[[Prototype]]` 的威力（委托）并且避免不必要的麻烦（比如使用 `new` 的构造函数调用会生成 `.prototype` 和 `.constructor` 引用）。
- <span style="background:yellow">唯一缺点</span>：需要创建一个新对象然后把旧对象抛弃掉，不能直接修改已有的默认对象。

		function Foo(name) {
		  this.name = name;
		}
		
		Foo.prototype.myName = function() {
		  return this.name;
		};
		
		function Bar(name, label) {
		  Foo.call(this, name);
		  this.label = label;
		}
		
		// 我们创建了一个新的 Bar.prototype 对象并关联到 Foo.prototype
		Bar.prototype = Object.create( Foo.prototype );
		
		// 注意！现在没有 Bar.prototype.constructor 了
		// 如果你需要这个属性的话可以手动修复一下它
		Bar.prototype.myLabel = function() {
		  return this.label;
		};
		
		var a = new Bar('a', 'obj a');
		
		console.log( a.myName() ); // 'a'
		console.log( a.myLabel() );  // 'obj a'

- 两种常见的错误做法：

		/**
		 * 该方式不会创建一个关联到 Bar.prototype 的新对象
		 * 只是让 Bar.prototype 直接引用 Foo.prototype 对象
		 */
		Bar.prototype = Foo.prototype;
		
		/**
		 * 该方式的确会创建一个关联到 Bar.prototype 的新对象
		 * 但是它使用了 Foo(..) 的“构造函数调用”，会影响 Bar() 的“后代”
		 */
		Bar.prototype = new Foo();
	
- ES6 添加了辅助函数 `Object.setPrototypeOf(..)`，可以用标准且可靠的方法来修改关联

		// ES6 之前需要抛弃默认的 Bar.prototype
		Bar.prototype = Object.create( Foo.prototype );
		
		// ES6 开始可以直接修改现有的 Bar.prototype
		Object.setPrototypeOf( Bar.prototype, Foo.prototype );

- 忽略调 `Object.create(..)` 方法带来的轻微性能损失（抛弃的对象需要进行垃圾回收），它实际上比 ES6 及其之后的方法更短而且可读性更高。

##### ☞ 对象关联

- `Object.create(null)` 会差un构建一个拥有空（或者说 `null`）`[[Prototype]]` 链接的对象，这个对象无法进行委托。由于这个对象没有原型链，所以 `instance` 操作符无法进行判断，因此总是会返回 `false`。这些特殊的空 `[[Prototype]]` 对象通常被称作“字典”，它们完全不会收到原型链的干扰，因此非常适合用来存储数据。

[`Object.create(..)` 的 Polyfill 代码]：

	if (!Object.create) {
  	  Object.create = function(o) {
    	function F() {}
    	F.prototype = o;
    	return new F();
  	  }
	}

### <p style="background:orange;">第6章 行为委托</p>