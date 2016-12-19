## Closure

### <p style="background:orange">闭包的定义1：</p>

- <span style="background:yellow">《JavaScript高级程序设计》定义闭包</span>：<span style="color:red">`闭包`</span>是指有权访问另一个函数作用域中的变量的函数。

- 创建闭包的常见方式，就是在一个函数内部创建另一个函数。

然而，<span style="color:red">`闭包`</span>总是和<span style="color:red">`作用域链`</span>联系在一起的。当某个函数被调用时，会创建一个<span style="color:red">`执行环境`</span>及相应的<span style="color:red">`作用域链`</span>。

### <p style="background:orange">几个概念：</p>

- **执行环境**：定义了变量或函数是否有权访问其他数据，决定了各自的行为。其**类型**只有两种：全局和局部（函数）。

> 某个执行环境中的所有代码执行完毕后，该环境被销毁，保存在其中的变量和函数定义也随之销毁。

> 执行环境包括：1. 全局执行环境；2. 函数执行环境（局部环境）；3. eval执行环境（不考虑）

- **变量对象**：每个执行环境都有一个与之关联的`变量对象`，环境中定义的所有变量和函数都保存在这个对象中。

- **作用域链**：当代码在一个环境中执行时，会创建变量对象的一个作用域链。其<span style="color:red">*用途*</span>是，保证对执行环境有权访问的所有变量和函数的有序访问。本质上是一个指向变量对象的指针列表，它只引用但不实际包含变量对象。

- **活动对象**：函数运行期的变量对象。该对象包含了函数的所有局部变量、命名参数、参数集合以及this。活动对象在最开始时只包含一个变量，即`arguments`对象（这个对象在全局环境中是不存在的）。this通过函数的arguments属性初始化，arguments属性的值是Arguments对象。

> 参考：[javascript高级程序第三版学习笔记【执行环境、作用域】](http://www.cnblogs.com/pigtail/archive/2012/07/19/2570988.html)

作用域链的前端，始终是是当前执行的代码所在环境的变量对象。如果这个环境是函数，则将其活动对象作为变量对象。作用域链中的下一个变量对象来自包含（外部）环境，而再下一个变量对象则来自下一个包含环境。这样，一直延续到全局执行环境；全局执行环境的变量对象始终都是作用域链中的最后一个对象。

当函数执行完毕后，局部活动对象就会被销毁，内存中仅保存`全局作用域`（全局执行环境的变量对象）。但是，`闭包`的情况又有所不同。在另一个函数内部定义的函数会将包含函数（即外部函数）的活动对象添加到它的作用域链中。

由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存。过度使用闭包可能会导致内存占用过多，建议在只有绝对必要时再考虑使用闭包。

### <p style="background:orange">闭包的定义2：</p>

- <span style="background:yellow">MDN中对闭包的定义</span>：闭包是一种特殊的对象。闭包 = 函数 + 创建该函数的环境。

- 环境由闭包创建时在作用域中的任何局部变量组成。闭包允许将函数与其操作的某些数据（环境）关联起来。

- 类似于面向对象编程：对象允许我们将某些数据（对象的属性）与一个或多个方法相关联。因此，一般来说，可以使用只有一个方法的对象的地方，都可以使用闭包。

### <p style="background:orange">闭包的用途：</p>

可以实现数据隐藏和封装。——>类似于Java中的get或set方法。

	function MyObject(name, message) {
		this.name = name.toString();
		this.message = message.toString();

		this.getName = function() {
			return this.name;
		}
		
		this.getMessage = function() {
			return this.message;
		}
	}

但是以上的方法会影响性能，因为将方法定义到对象的构造器中，每次构造器被调用，方法都会被重新赋值一次。

应该改用原型实现方法：

	function MyObject(name, message) {
	  this.name = name.toString();
	  this.message = message.toString();
	}
	MyObject.prototype = {
	  getName: function() {
	    return this.name;
	  },
	  getMessage: function() {
	    return this.message;
	  }
	};

或者：

	function MyObject(name, message) {
	  this.name = name.toString();
	  this.message = message.toString();
	}
	MyObject.prototype.getName = function() {
	  return this.name;
	};
	MyObject.prototype.getMessage = function() {
	  return this.message;
	};


参考链接：

[MDN（闭包）](https://developer.mozilla.org/cn/docs/Web/JavaScript/Closures)

[JavaScript秘密花园](http://www.jb51.net/onlineread/JavaScript-Garden-CN/#function.closures)

[JavaScript之执行环境及作用域](http://www.cnblogs.com/zxj159/archive/2013/05/17/3084598.html)