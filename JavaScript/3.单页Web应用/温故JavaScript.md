## 温故 JavaScript

### <p style="background:orange">&nbsp;变量作用域，函数提升和执行环境对象</p>

##### <p style="background: #cfc9fa">1. 变量作用域<p>

在 JavaScript 中，<span style="color:red">`变量`</span> 的 <span style="color:red">`作用域`</span> 由 <span style="color:red">`函数`</span> 限定，即：唯一能定义变量作用域的语块就是 <span style="color:red">`函数`</span>。

`变量` 要么是全局的，要么是局部的。

- 全局变量：在函数外部定义，处处可以访问；
- 局部变量：在函数内部定义，只有在声明它的地方才能访问。

> ES6 引入块级作用域——> `let` 语句
	
	let (prisoner = 'I am in prison!') {
		console.log( prisoner );	// "I am in prison!"
	}

	console.log( prisoner );	// Erroe:prisoner is not defined"


##### <p style="background: #cfc9fa">2. 变量提升</p>

在 JavaScript 中，当变量被声明时，声明会被提升到它所在函数的顶部，并被赋予 undefined 值。这就使得在函数的任意位置声明的变量存在于整个函数中，尽管在赋值之前，它的值一直为 undefined。

<img width="600" height="200" alt="变量提升1" src="https://github.com/RukiQ/blog-learning-patch/blob/master/JS-%E5%8D%95%E9%A1%B5Web%E5%BA%94%E7%94%A8/img/%E5%8F%98%E9%87%8F%E6%8F%90%E5%8D%871.png?raw=true">
	
	function prison () {
	    console.log(prisoner);  // "undefined"
	
	    var prisoner = 'Now I am defined!';
	
	    console.log(prisoner);  // "Now I am defined!"
	}
	
	prison();

- 因为变量声明总是被提升到函数作用域的顶部，所以在函数的顶部声明变量总是最好的做法，更好的是使用**单个 `var` 语句**，这样可以和 JavaScript 的做法保持一致。

<span style="color:#ac4a4a">**作用域和变量提升结合**</p>

[例1：]

	var name = 'Joe';
	
	function prison () {
	    console.log(name);	// "Joe"
	}
	
	prison();

[例2：变量在声明前是未定义的]

	var name = 'Joe';
	
	function prison () {
	    console.log(name);	// "undefined"
	    var name;	// name的声明被提升到函数的顶部，在查找全局作用域的name之前，会先检查这一被提升的声明
	}
	
	prison();

[例3：变量在声明前有值]

	// 变量作为参数传入
	var name = 'Joe';

	function prison ( name ) {
	    console.log(name);  // "Bob"
	    var name;	// 变量name已经由参数赋值，当声明它时，不会用undefined值覆盖。这里的声明是多余的。
	
	    console.log(name);  // "Bob"
	}
	
	prison( 'Bob' );


##### <p style="background: #cfc9fa">3. 高级变量提升和执行环境对象</p>

<span style="color:#ac4a4a">**提升**</span>

JavaScript 引擎在进入作用域时，会对代码分两轮处理：（1）初始化变量；（2）执行代码。

第一轮**初始化变量**，JavaScript 引擎分析代码，并做了以下3件事情：

1）声明并初始化函数参数；

2）声明局部变量，包括将匿名函数赋给一个局部变量，但并不初始化他们；

3）声明并初始化函数。

> 在第一轮，**局部变量并未被赋值**，因为可能需要在代码执行后才能确定它的值，而第一轮不会执行代码。

> **参数被赋值了**，因为在向函数传递参数之前，任何决定参数值的代码都可以运行了。

<img width="600" height="240" alt="第一轮初始化变量" src="https://github.com/RukiQ/blog-learning-patch/blob/master/JS-%E5%8D%95%E9%A1%B5Web%E5%BA%94%E7%94%A8/img/%E7%AC%AC%E4%B8%80%E8%BD%AE%E5%88%9D%E5%A7%8B%E5%8C%96%E5%8F%98%E9%87%8F.png?raw=true">

<span style="color:#ac4a4a">**执行环境和执行环境对象**——>理解 javaScript 引擎在第一轮是如何保存变量的</span>

JavaScript 引擎把变量作为一个属性保存在一个对象上，这个对象称为 <span style="color:red">`执行环境对象`</span>。

- <span style="color:red">`执行环境`</span>：每当函数被调用的时候，就会产生一个新的执行环境，即，指函数的执行。
- <span style="color:red">`函数声明`</span>：描述了当函数执行的时候会发生什么事情。
- 属于执行环境部分的变量和函数，被保存在 <span style="color:red">`执行环境对象`</span> 中，执行环境对象是对执行环境的 ECMA 标准实现。

> `执行环境` 是一种概念，是<span style="background:yellow">运行中的函数</span>的意思，由函数在执行时发生的所有事物组成，它不是对象。
>
> `执行环境` 和 `函数声明` 是分离的。

所有在函数中定义的 `变量` 和 `函数` 都是 `执行环境` 的一部分。当谈论函数的 `作用域` 时，`执行环境` 也是其所指的一部分。如果变量在当前执行环境中可访问，则变量在作用域内（即：如果在函数运行时变量可访问，则该变量在作用域内）。

在 JavaScript 引擎中，<span style="color:red">`执行环境对象`</span> 是一种对象，属于 JavaScript 实现层面的东西，在开发的时候无法直接访问。<span style="background:yellow">间接地访问执行环境对象</span>是很容易的，因为每次使用变量，就是在访问执行环境对象的属性。

<img width="600" height="150" alt="执行环境对象" src="https://github.com/RukiQ/blog-learning-patch/blob/master/JS-%E5%8D%95%E9%A1%B5Web%E5%BA%94%E7%94%A8/img/%E6%89%A7%E8%A1%8C%E7%8E%AF%E5%A2%83%E5%AF%B9%E8%B1%A1.png?raw=true">

由于可以在执行环境中调用函数，会产生很多层的深度。在执行环境中调用函数，会创建一个新的嵌套在已存在的执行环境内的执行环境。

<img width="600" height="400" alt="调用函数会创建一个执行环境" src="https://github.com/RukiQ/blog-learning-patch/blob/master/JS-%E5%8D%95%E9%A1%B5Web%E5%BA%94%E7%94%A8/img/%E8%B0%83%E7%94%A8%E5%87%BD%E6%95%B0%E4%BC%9A%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%89%A7%E8%A1%8C%E7%8E%AF%E5%A2%83.png?raw=true">

JavaScript 引擎在执行环境对象中访问作用域内的变量，查找的顺序叫作 `作用域链`，它和 `原型链` 一起，描述了 JavaScript 访问变量和属性的顺序。

### <p style="background:orange">&nbsp;解释变量作用域链以及为什么要使用它们</p>

作用域是很微妙的，像嵌套执行环境。更准确地讲，可以把变量作用域看作链 ——> `作用域链`。

在运行期，JavaScript 会检索作用域层级来解析变量名。

>
> 它从当前作用域开始，然后按它的查找方式回到顶级的作用域，即 window（浏览器）或者 global（node.js）对象。
> 它使用找到的第一次匹配并停止查找。

在层级更深的嵌套作用域中的变量，会使用它们的当前作用域替换更加全局的作用域，从而隐藏更加全局的作用域中的变量。

### <p style="background:orange">&nbsp;使用原型创建 JavaScript 对象</p>

JavaScript 对象是基于原型的，而当今其他广泛使用的语言全部都使用基于类的对象。

<span style="color:red">区别：</span>

- 在基于类的系统中，定义对象：使用类来描述它是什么样子的。
	
		类比：如果建筑是基于类的系统，则建筑师会先画出房子的蓝图，然后房子都按照蓝图来建造；

- 在基于原型的系统中，我们创建的对象，看起来要像我们想要的所有这种类型的对象那样，然后告诉JavaScript引擎，我们想要更多像这样的对象。
		
		类比：如果建筑是基于原型的系统，则建筑师先建一所房子，然后将房子都建成像这种模样的。

<span style="color:#ac4a4a">**简单对象创建：类和原型的比较**</span>

<img width="600" height="200" alt="类和原型的比较" src="https://github.com/RukiQ/blog-learning-patch/blob/master/JS-%E5%8D%95%E9%A1%B5Web%E5%BA%94%E7%94%A8/img/%E7%B1%BB%E5%92%8C%E5%8E%9F%E5%9E%8B%E7%9A%84%E6%AF%94%E8%BE%83.png?raw=true">

- 基于原型的对象更简单，并且当只有一个对象实例时，编写更快，只要在适当的地方简单地定义它就行了，它也支持更复杂的使用情况，使多个对象共享相似的特性。
- 在基于类的系统中，你得先定义类，定义构造函数，然后实例化对象，该对象是这个类的实例。

<span style="color:#ac4a4a">**多个对象：类和原型的比较**</span>

##### [*基于类的*]：

	/* step 1：定义类*/
	public class Prisoner {
		public int sentence = 4;
		public int probation = 2;
		public String name;
		public String id;
		
		/* step 2：定义类的构造函数*/
		public Prisoner( String name, String id ) {
			this.name = name;
			this.id = id;
		}
		
		public static void main( String []args ) {
			/* step 3：实例化对象*/
			Prisoner firstPrisoner = new Prisoner("Joe", "12A");
	
			Prisoner secondPrisoner = new Prisoner("Sam", "2BC");
			
			System.out.println(firstPrisoner.name);
		}
	}

##### [*基于原型的*]：
	
	// step 1：定义原型对象
	var proto = {
		sentence : 4,
		probation : 2
	};
	
	// step 2：定义对象的构造函数
	var Prisoner = function(name, id) {
		this.name = name;
		this.id = id;
	}
	
	// step 3：将构造函数关联到原型
	Prisoner.prototype = proto;
	
	// step 4：实例化对象
	var firstPrisoner = new Prisoner('Joe', '12A');
	var secondPrisoner = new Prisoner('Sam', '2BC');

<span style="background:yellow">补充说明：</span>

1）在每个方法中，首先创建了 `对象的模版`，作为创建对象的结构。模板在基于类的编程中叫做 `类`，在基于原型的编程中叫作 `原型对象`。

2）然后，创建了 `构造函数`。在基于类的语言中，构造函数是在类的内部定义的，这样的话，当实例化对象时，哪个构造函数与哪个类匹配，就很清晰了。在 JavaScript 中，对象的构造函数和原型是分开设置的，所以不需要额外多一步来将它们连接在一起。

3）最后，实例化对象。

> JavaScript 使用了 `new` 操作符，违背了它基于原型的核心思想，可能是试图让熟悉基于类继承的开发人员更容易理解。用 `Object.create` 方法作为 `new` 操作符的替代方案，来创建 JavaScript 对象，能增添一种更像是基于原型的感觉。

	/**
	 * Object.create() 方法：
	 * 把原型作为参数并返回一个对象，使用这种方式，可以在原型对象上定义共同的属性和方法，
	 * 然后使用它来创建多个共享相同属性的对象。
	 */
	var proto = {
		sentenct : 4,
		probation : 2
	}
	
	var firstPrisoner = Object.create( proto );
	firstPrisoner.name = 'Joe';
	firstPrisoner.id = '12A';
	
	var secondPrisoner = Object.create( proto );
	secondPrisoner.name = 'Sam';
	secondPrisoner.id = '2BC';

Object.create() 的改进方案：使用工厂函数来创建并返回最终的对象。

	/**
	 * 使用 Object.create() 和工厂函数
	 */
	var proto = {
		sentenct : 4,
		probation : 2
	}
	
	var makePrisoner = function( name, id ) {
	
		var prisoner = Object.create( proto );
		prisoner.name = name;
		prisoner.id = id;
	
		return prisoner;
	}
	
	var firstPrisoner = makePrisoner( 'Joe', '12A' );
	
	var secondPrisoner = makePrisoner( 'Sam', '2BC' );

>  Object.create() 方法：创建对象的最佳方法，它清晰地说明了原型是如何被设置的（有兼容性问题）。
>  
>  `new` 操作符：创建对象的最常用方法，但是它遮掩了原型系统的细微差别。

	// Cross-browser method to support Object.create()

	var objectCreate = function ( arg ) {
		if ( ! arg ) { return {}; }
		function obj() {};
		obj.prototype = arg;
		return new obj;
	};
	
	Object.create = Object.create || objectCreate;

### <p style="background:orange">&nbsp;编写自执行匿名函数</p>

##### <p style="background: #cfc9fa">1. 函数和匿名函数：</p>

	// 声明函数
	function prison () {}

	// 使用变量来保存函数
	var prison = function prison () {};

	// 用局部变量来保存的匿名函数
	var prison = function () {};

	// 调用方式都相同
	prison();

##### <p style="background: #cfc9fa">2. 自执行匿名函数：</p>

<span style="background:yellow">抛出问题</span>：在 JavaScript 中，在全局作用域中定义的所有东西在每个地方都是可用的。有时候你不想和所有人共享，不想第三方库共享它们的内部变量，因为这很容易覆盖对象的库，从而导致难以诊断的问题。

<span style="background:yellow">解决方法</span>：

- 1）把整个程序封装在函数中，然后调用这个函数，这样外部代码就不能访问到变量了——>冗长和不灵活；

- 2）自执行匿名函数（因为定义它时没有名字并且没有保存给变量，但却立即执行了）——>推荐。


<img width="600" height="160" alt="显式调用和自执行函数的比对" src="https://github.com/RukiQ/blog-learning-patch/blob/master/JS-%E5%8D%95%E9%A1%B5Web%E5%BA%94%E7%94%A8/img/%E6%98%BE%E5%BC%8F%E8%B0%83%E7%94%A8%E5%92%8C%E8%87%AA%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0%E7%9A%84%E5%AF%B9%E6%AF%94.png?raw=true">

<span style="color:red">优点：</span>用来控制变量的作用域，阻止变量泄漏到代码的其他地方。

<span style="color:red">用途：</span>可用于创建 JavaScript 插件，不会和应用代码冲突，因为它不会向全局名字空间添加任何变量。

##### [*给匿名函数传参和普通函数传参对比*]：

	// 普通函数传参
	var eatFunction = function (what_to_eat) {
		var sentence = 'I am going to eat a ' + what_to_eat;
		console.log( sentence );
	}
	
	eatFunction( 'sandwich' );	// I am going to eat a sandwich
	
	
	// 自执行匿名函数传参
	(function (what_to_eat) {
		var sentence = 'I am going to eat a ' + what_to_eat;
		console.log( sentence );
	})('hotdog');	// I am going to eat a hotdog

##### [*常用例子*]：

	// 保证函数作用域里面，$ 是 jQuery 对象
	( function ( $ ) {
		console.log( $ );
	} )( jQuery );	

### <p style="background:orange">&nbsp;使用模块模式和私有变量</p>

<span style="background:yellow">抛出问题</span>：虽然我们可以把应用封装在自执行匿名函数中，使应用免受第三方库（和我们自己）的影响，但是单页应用和庞大，不能定义在一个文件中。

<span style="background:yellow">解决思路</span>：将文件分成一个个的模块，每个模块都有它们自己的私有变量。

	/** 
	 * 匿名函数没有保存在 prison 变量中，因为匿名函数被执行了
	 * 匿名函数的返回值保存在 prison 中
	 */
	var prison = (function () {
		var prisoner_name = 'Mike Mikowski',
			jail_term = '20 year term';
	
		return {
			prisoner: prisoner_name + ' - ' + jail_term,
			sentence: jail_term
		};
	})();
	
	console.log( prison.prisoner_name );	// "undefined"
	
	console.log( prison.prisoner );	// "Mike Mikowski - 20 year term"
	
	console.log( prison.sentence );	// "20 year term"
	
	/**
	 * jail_pterm 不是 prison 对象或者原型上的属性，它是执行环境中创建的对象变量
	 * prison 变量保存了这个变量，并且执行环境已不复存在，因为函数已经执行结束。
	 */
	console.log( prison.jail_term );	// "undefined"
	
	prison.jail_term = 'Sentence commuted';
	console.log( prison.jail_term );	// "Sentence commuted"
	
	console.log( prison.prisoner );	// "Mike Mikowski - 20 year term"

- 在稍大一点的模块中，<span style="background:yellow">减少全局变量</span>是很重要的。

- 一旦自执行匿名函数停止执行，在它里面定义的变量没有了，所以它们是不能被更改的，所以它们无法通过 prison 变量访问到。它们用来定义匿名函数的返回对象上的 prison 和 sentence 属性，并且这些属性可以在 prison 变量上访问到。

- `prisoner_name` 和 `jail_term` 这些属性只在匿名函数执行时设置了一次，永远不会被更新。它们像是 `prison` 对象的私有变量，只能通过匿名函数返回的对象上的方法来访问，不能在该对象或者原型上直接访问。

- 为了能更新“私有变量”，我们必须<span style="background:yellow">把属性转变为方法，每次调用它们时都会访问变量。</span>

		var prison = (function () {
			var prisoner_name = 'Mike Mikowski',
				jail_term = '20 year term';
		
			return {
				prisoner: function () {
					return prisoner_name + ' - ' + jail_term;
				},
				setJailTerm: function ( term ) {
					jail_term = term;
				}
			};
		})();
		
		console.log( prison.prisoner() );	// "Mike Mikowski - 20 year term"
		
		prison.setJailTerm( 'Sentence commuted' );
		
		console.log( prison.prisoner() ); // "Mike Mikowski - Sentence commuted"

### <p style="background:orange">&nbsp;探索闭包的乐趣和好处</p>

##### <p style="background: #cfc9fa">1. 什么是闭包：</p>

JavaScript 有 <span style="color:red">`垃圾回收器`</span>：当函数执行完毕时，管理内存的本地方法会将函数中所有创建了的东西从内存中移除。

<span style="color:red">闭包</span>是阻止垃圾回收器将变量从内存中移除的方法，使得在创建变量的执行环境的外面能够访问到该变量。

	var prison = (function () {
		var prisoner = 'Josh Powell';
	
		/**
		 * 在 prisoner 函数被保存到 prison 对象上时，一个闭包就创建了。
		 * 闭包因保存函数而被创建，在执行环境的外面，可以动态访问 prisoner 变量，
		 * 这就阻止了垃圾回收器将 prisoner 变量从内存中移除。
		 */
		return {
			prisoner: function () {
				return prisoner;
			}
		};
	})();

	prison.prisoner();	// "Josh Powell"

##### [*闭包示例1*]：

	var makePrisoner = function ( prisoner ) {
		return function () {
			return prisoner;
		}
	};
	
	var joshPrison = makePrisoner( 'Josh Powell' );
	var mikePrison = makePrisoner( 'Mike Mikowski' );
	
	console.log( joshPrison() );	// "Josh Powell"
	console.log( mikePrison() );	// "Mike Mikowski"

##### [*闭包示例2*]：<span style="color:#ac4a4a">**保存变量以便在 Ajax 请求返回时使用。**</span>

	/**
	 * 当使用 JavaScript 对象中的方法时，this 指向这个对象。
	 */
	var prison = {
		names: 'Mike Mikowski and Josh Powell',
		who: function () {
			return this.names;
		}
	};
	
	prison.who();	// "Mike Mikowski and Josh Powell"

	/**
	 * 如果是 jQuery 来发送 Ajax 请求的方法，则 this 不再指向对象，它指向 Ajax 请求对象
	 */
	var prison = {
		names: 'Mike Mikowski and Josh Powell',
		who: function () {
			$.ajax({
				success: function () {
					console.log( this.names );
				}
			});
		}
	};
	// 'this' is the ajax object
	prison.who();	// "undefined"

<span style="background:yellow">闭包由函数创建</span>，该函数在当前执行环境中访问了某个变量，并将该函数保存给当前执行环境外的一个变量。

##### [*闭包示例3*]：<span style="color:#ac4a4a">**通过把 this 保存给 that，在函数中访问 that，从而创建了一个闭包**</span>

	var prison = {
		names: 'Mike Mikowski and Josh Powell',
		who: function () {
			var that = this;
			$.ajax({
				success: function () {
					console.log( that.names );
				}
			});
		}
	};
	
	/**
	 * 尽管在 Ajax 请求返回的时候，who() 已经执行完毕，但是 that 变量不会被垃圾回收
	 * 在 success 方法中可以使用该变量
	 */
	prison.who();	// "Mike Mikowski and Josh Powell"

##### <p style="background: #cfc9fa">2. 闭包是如何工作的：</p>

参看[闭包示例1]，当调用 makePrison 时，为这次特定的调用创建了一个执行环境对象，将传入的值赋予 prisoner。

##### [*闭包示例4*]：

	var curryLog, logHello, logGoodbye;
	
	curryLog = function ( arg_text ) {
		var log_it = function () { console.log( arg_text ); }
		return log_it;
	};
	
	logHello = curryLog('hello');
	logGoodbye = curryLog('goodbye');
	
	curryLog('fred')();	// 'fred'
	
	logHello();	// 'hello'
	logGoodbye();	// 'goodbye'
	
	delete window.logGoodbye;	// 通过 var 声明的变量是不能通过 delete 操作符来删除的
	
	logGoodbye();	// 'goodbye'

<span style="color:red">注意：</span>

1）每次调用函数时都会创建一个唯一的执行环境对象。

2）执行环境对象是 JavaScript 引擎的一部分，在 JavaScript 中不能直接访问。

3）函数执行完后，执行对象就会被丢弃，除非调用者引用了它。

4）如果函数返回的是数字，就不能引用函数的执行环境对象。但是，如果函数返回的是一个更复杂的结构，像是函数、对象或者数组，将返回值保存到一个变量上（有时是误用），就创建了一个对执行环境的引用。

##### [*闭包示例5*]：

	var menu, outer_function,
		food = 'cake';
	
	outer_function = function () {
		var fruit, inner_function;
	
		fruit = 'apple';
	
		inner_function = function () {
			return {
				food: food,
				fruit: fruit
			};
		}
	
		return inner_function;
	};
	
	menu = outer_function();
	
	menu();	// {food: "cake", fruit: "apple"}

<span style="background:yellow">解释说明：</span>

- 当调用 `outer_function` 时，创建了一个执行环境。

- 在这个执行环境中定义了 `inner_function`，因为在 `outer_function` 执行环境里面定义了 `inenr_function`，它有权限访问 `outer_function` 作用域内的所有变量，这里是 `food`、`fruit`、`outer_function`、`inner_function` 和 `menu`。

- 当 `outer_function` 执行完时，你可能期望在执行环境中的所有东西都会被垃圾回收期销毁。——>错！

- 然而，因为 `inner_function` 的引用保存给了全局作用域中的变量 `menu`，所以它并不会被销毁。

- 在声明 `inner_function` 的作用域内，需要保留对所有变量的访问权限，它“关闭”了 `outer_function` 执行环境的大门，阻止垃圾回收器来移除它们。

- 这就是闭包！！！！！


##### [*闭包示例6*]：

	function sendAjaxRequest() {
		var scoped_var = 'yay';
		$.ajax({
			success: function () {
				console.log(scoped_var);
			}
		});
	}
	
	sendAjaxRequest();	// 当 Ajax 请求成功完成时，输出 'yay'

<span style="background:yellow">问</span>：为什么在 Ajax 请求返回后，scope_var 还是可以访问的？

<span style="background:yellow">答</span>：因为 `success` 方法是在调用 `sendAjaxRequest` 时创建的执行环境中定义的，此时 `scoped_var` 在作用域中。

