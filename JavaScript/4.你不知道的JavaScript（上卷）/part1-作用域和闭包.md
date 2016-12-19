### <p style="background:orange;">第1章 作用域是什么</p>

<span style="color:#ac4a4a">*抛出问题*</span>：程序中的变量存储在哪里？程序需要时，如何找到它们？

设计 `作用域` 的*目的*：为了更好地存储和访问变量。

`作用域`：根据名称查找变量的一套规则，用于确定在何处以及如何查找变量（标识符）。

#### <p style="background: #cfc9fa">☞ 编译原理

JavaScript 是一门编译语言，但它*不是* 提前编译的，编译结果也不能在分布式系统中进行移植。

程序的源代码在执行前的三个步骤，统称为<span style="background:yellow">“编译”</span>：

1. 分词/词法分析：将字符串分解成代码块（词法单元）
2. 解析/语法分析：将词法单元流（数组）转换成抽象语法树（Abstract Syntax Tree, AST）
3. 代码生成：将AST转换成可执行代码

JavaScript 引擎不会有大量的（像其他语言编译器那么多的）时间用来进行优化。JavaScript 的编译不是发生在构建之前，而是<span style="background:yellow">发生在代码执行前的几微秒，甚至更短</span>。因此，JavaScript 引擎用尽了各种方法来保证新更能最佳。

#### <p style="background: #cfc9fa">☞ 理解作用域

- 引擎
	
	从头到尾负责整个JavaScript程序的编译及执行过程；

- 编译器

	负责语法分析及代码生成；

- 作用域

	负责收集并维护所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

> 总结：变量的赋值操作会执行两个动作——>
> 
> 1）编译器会在当前作用域中声明一个变量（如果之前没有声明过）；
> 2）在运行时，引擎会在作用域中查找该变量，如果能够找到就会对它赋值。

<span style="color:#ac4a4a">**引擎的LHS查询和RHS查询**</span>

- LHS查询：赋值操作的左侧，试图找到变量的容器本身，从而可以对其赋值；

		// 不关心当前的值是什么，只是想要为 =2 这个赋值操作找到一个目标
		a = 2;
		
> 不成功的 LHS引用 会导致自动隐式创建一个全局变量（非严格模式下），该变量使用 LHS 引用的目标作为标识符，或者抛出 ReferenceError 异常。

- RHS查询：赋值操作的右侧，查找某个变量的值。

		// a 并没有赋予任何值
		// 需要查找并取得 a 的值，这样才能传递给 console.log(...)		
		console.log( a );

> 不成功的 RHS 查询引用会抛出 ReferenceError 异常。

<span style="color:#ac4a4a">**嵌套作用域**</span>

LHS 查询和 RHS 查询都会在当前执行作用域中开始，如果没有找到，就会向上级作用域继续查找目标标识符，直至抵达全局作用域，便停止。

### <p style="background:orange;">第2章 词法作用域</p>

<span style="color:#ac4a4a">**作用域的两种工作模型：**</span>

- 词法作用域：定义在词法阶段的作用域，即，是由你在写代码时将变量和块作用域写在哪里来决定的。
- 动态作用域：在运行时确定，关注函数从何处调用——>this。

![嵌套作用域](https://github.com/RukiQ/blog-learning-patch/blob/master/%E3%80%8A%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84JavaScript%E3%80%8B/img/%E5%B5%8C%E5%A5%97%E4%BD%9C%E7%94%A8%E5%9F%9F.png?raw=true)

> 作用域气泡由其对应的作用域块代码写在哪里决定，它们是逐级包含的。

#### <p style="background: #cfc9fa">☞ 查找

作用域气泡的结构和互相之间的位置关系给引擎提供了足够的位置信息，引擎用这些信息来查找标识符的位置。

#### <p style="background: #cfc9fa">☞ 欺骗词法

—— 在运行期修改书写期的词法作用域，会导致性能下降，不要使用。

**(1) eval:** 接受一个字符串作为参数，并将其中的内容视为好像在书写时就存在于程序中这个位置的代码。会修改词法作用域。

	function foo(str, a) {
	  eval( str );  // 欺骗！
	  console.log(a, b);
	}
	
	var b = 2;
	
	foo( 'var b = 3;', 1);  // 1,3

> 在严格模式中，无法修改所在的作用域。

**(1) with:** 重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身。会重新创建一个全新的词法作用域。

> 在严格模式中，with 被完全禁止。 

### <p style="background:orange;">第3章 函数作用域和块作用域</p>

#### <p style="background: #cfc9fa">☞ 函数作用域

函数作用域：指属于这个函数的全部变量都可以在整个函数的范围内使用及复用（嵌套作用域也可以）。

- 最小特权原则（最小授权/最小暴露原则）
		
	指在软件设计中，应该最小限度地暴露必要内容，而将其他内容都“隐藏”起来，比如某个模块或对象的API设计。

隐藏作用域的好处：

- 遵循最小特权原则，避免暴露过多的变量和函数；
- 避免同名标识符之间的冲突。 

规避冲突的方式：1）全局命名空间；2）模块管理。

函数声明和函数表达式之间最重要的区别是它们的名称标识符将会绑定在何处。前者会绑定在所在作用域中，而后者会绑定在函数表达式自身的函数中而不是所在作用域中。 

*行内函数表达式* 可以解决匿名函数表达式的缺点。<span style="background:yellow">始终给函数表达式命名是一个最佳实践。</span>

	setTimeout(function timeoutHandler() {
	  //...
	}, 1000);

#### <p style="background: #cfc9fa">☞ 立即执行函数表达式

具名函数的IIFE（立即执行函数表达式）具有匿名函数表达式的所有优势，也是值得推广的实践。

- IIFE 的进阶用法：把它们当作函数调用并传递参数进去。

		var a = 2;
		(function IIFE(global) {
		  var a = 3;
		  console.log(a); //3
		  console.log(global.a);  // 2
		})(window);
		
		console.log(a); // 2

- 这个模式的另一个应用场景：解决 `undefined	 标识符的默认值被错误覆盖导致的异常（虽然不常见）

		undefined = true;	// 反模式，绝对不要这么做！
		
		(function IIFE(undefined) {
		  var a;
		  if (a === undefined) {
		    console.log('undefined is safe here!');
		  }
		})();

- IIFE 还有一种变化的用途：倒置代码的运行顺序，将需要运行的函数放在第二位，在IIFE执行之后当做参数传递进去。

		var a = 2;
		(function IIFE(def) {
		  def(window);
		})(function def(global) {
		
		  var a = 3;
		  console.log(a); // 3;
		  console.log(global.a);  // 2
		});

#### <p style="background: #cfc9fa">☞ 块作用域

块作用域的好处：变量的声明应该距离使用的地方越近越好，并最大限度地本地化。

块作用域的例子：with、try/catch、let、const

> 使用 `let` 进行的声明不会在块作用域中进行提升。

### <p style="background:orange;">第4章 提升</p>

引擎会在解释 JavaScript 代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来。

包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理。这个过程就好像所有的声明（变量和函数）都会被“移动”到各自作用域的最顶端，这个过程被称为<span style="color:red">提升</span>。

##### [*例子*]

		// 我们习惯将它看作一个声明
		var a = 2;
		
		/**
		 * JavaScript 引擎会把它当作两个单独的声明
		 */
		var a; 	// 定义声明，在编译阶段进行
		a = 2;	// 赋值声明，在执行阶段进行

- 每个作用域都会进行*提升* 操作。但，函数声明会被提升，函数表达式不会被提升。

- 避免在块内部声明函数。

### <p style="background:orange;">第5章 作用域闭包</p>

当**函数**可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

	function foo() {
	  var a = 2;
	
	  function bar() {
	    console.log(a);
	  }
	
	  return bar;
	}
	
	var baz = foo();
	
	// 实际上只是通过不同的标识符引用调用了内部的函数 bar()
	baz();  // 2 —— 闭包的效果

> 由于 bar() 声明的位置，它拥有涵盖 foo() 内部作用域的闭包，使得该作用域能够一直存活，以供 bar() 在之后的任何时间进行引用。
>
> bar() 依然持有对该作用域的引用，这个引用就叫作**闭包**。

闭包的作用：阻止垃圾回收器回收内部作用域，使得函数在定义时的词法作用域以外的地方被调用时，仍然可以继续访问定义时的词法作用域。

##### [*闭包示例2：*]

	function foo() {
	  var a = 2;
	
	  function baz() {
	    console.log(a);
	  }
	
	  bar(baz);
	}
	
	function bar(fn) {
	  fn(); // 闭包
	}

	foo();	// 2

##### [*闭包示例3：*]

	var fn;

	function foo() {
	  var a = 2;
	
	  function baz() {
	    console.log(a);
	  }
	
	  fn = baz; // 将 baz 分配给全局变量
	}
	
	function bar() {
	  fn(); // 闭包
	}
	
	foo();
	
	bar();	// 2

> 无论通过何种手段将**内部函数**传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。

在定时器、事件监听器、Ajax请求、跨窗口通信、Web Workers或者任何其他的异步（或者同步）任务中，只要使用了回调函数，实际上就是在使用闭包！

#### <p style="background: #cfc9fa">☞ 模块——利用闭包实现

最常见的实现模块模式的方法通常被成为 `模块暴露`：

	function CoolModule() { 
	  var something = 'cool';
	  var another = [1,2,3];
	
	  function doSomething() {
	    console.log(something);
	  }
	
	  function doAnother() {
	    console.log(another.join('!'));
	  }
	
	  return {
	    doSomething : doSomething,
	    doAnother : doAnother
	  }
	}
	
	/** 
	 * 必须通过调用 CoolModule() 来创建一个模块实例
	 * 如果不执行外部函数，内部作用域和闭包都无法被创建
	 */
	var foo = CoolModule();
	foo.doSomething();  // cool
	foo.doAnother();  // 1!2!3

模块模式需要具备两个条件：

1. 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）。
2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。

> 一个具有函数属性的对象并不是真正的模块；
> 
> 一个从函数调用所返回的，只有数据属性而没有闭包函数的对象并不是真正的模块。

##### [*单例模式：当只需要一个实例时*]：

	var foo = (function CoolModule() {
	  // ...
	})();
	
	foo.doSomething();  // cool
	foo.doAnother();  // 1!2!3

##### [*模块模式的变化用法：命名将要作为公共API返回的对象*]：

	var foo = (function CoolModule(id) {
	  function change() {
	    // 修改公共API
	    publicAPI.identify = identify2;
	  }
	
	  function identify1() {
	    console.log(id);
	  }
	
	  function identify2() {
	    console.log(id.toUpperCase());
	  }
	
	  var publicAPI = {
	    change: change,
	    identify: identify1
	  }
	})('foo module');
	
	foo.identify(); // 'foo module'
	foo.change();
	foo.identify(); // 'FOO MODULE'

> 通过在模块内部保留对公共API对象的内部引用，可以从内部对模块实例进行修改，包括添加或删除方法和属性，以及修改它们的值。


#### <p style="background: #cfc9fa">☞ 现代的模块机制<span style="color:red">(没太看明白）</span>

大多数模块依赖加载器/管理器本质上都是将这种模块定义封装进一个友好的 API。

	var MyModules = (function Manager() {
	  var modules = {};
	
	  function define(name, deps, impl) {
	    for (var i=0; i<deps.length; i++) {
	      deps[i] = modules[deps[i]];
	    }
	    modules[name] = impl.apply(impl, deps);
	  }
	
	  function get(name) {
	    return modules[name];
	  }
	
	  return {
	    define: define,
	    get: get
	  };
	})();
	
	
	// 定义模块
	MyModules.define('bar', [], function() {
	  function hello(who) {
	    return 'Let me introduce: ' + who;
	  }
	
	  return {
	    hello: hello
	  };
	});
	
	MyModules.define('foo', ['bar'], function() {
	  var hungry = 'hippo';
	
	  function awesome() {
	    console.log(bar.hello(hungry).toUpperCase());
	  }
	
	  return {
	    awesome: awesome
	  };
	});
	
	var bar = MyModules.get('bar');
	var foo = MyModules.get('foo');
	
	console.log(
	  bar.hello('hippo')
	);  // Let me introduce: hippo
	
	foo.awesome(); 


#### <p style="background: #cfc9fa">☞ 未来的模块机制

ES6 的模块没有“行内”格式，必须被定义在独立的文件中（一个文件一个模块）。浏览器或引擎有一个默认的“模块加载器”可以在导入模块时异步地加载模块文件。

bar.js

	function hello(who) {
	  return "Let me introduce: " + who;
	}
	
	export hello;

foo.js

	// 仅从 'bar' 模块导入 hello()
	import hello from 'bar';
	
	var hungry = 'hippo';
	
	function awesome() {
	  console.log(
	    hello(hungry).toUpperCase()
	  );
	}
	
	export awesome;

baz.js

	// 导入完整的 “foo” 和 “bar” 模块
	module foo from 'foo';
	module bar from 'bar';
	
	console.log(
	  bar.hello('rhino')
	);  // Let me introduce: rhino
	
	foo.awesome();  // LET ME INTRODUCE: HIPPO

- import：将一个模块中的一个或多个API导入到当前作用域中，并分别绑定在一个变量上；
- module：将整个模块的API导入并绑定到一个变量上；
- export：将当前模块的一个标识符（变量、函数）导出为公共API。
