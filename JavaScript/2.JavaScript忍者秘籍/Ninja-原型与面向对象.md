## 原型与面向对象

原型虽然是定义对象的一种很方便的方式，但它的本质依然是<span style="color:red">*函数特性*<span>。

使用原型所定义的属性和功能会自动应用到对象的实例上。

JavaScript 原型的<span style="color:red">*主要用途*</span>：使用一种类风格的面向对象和继承技术进行编码

### <p style="background:#orange;">利用函数实现构造器</p>

- 所有的*函数* 在初始化的时候都有一个 `prototype` 属性，该属性的初始值是一个空对象。只有函数在作为构造器的时候，`prototype` 属性才会发挥更大的作用。

- 函数作为构造器进行调用时，函数的原型对象是新对象的一个概览。

- 在构造器内创建的实例方法会阻挡在原型上定义的同名方法。

- 在构造器内的绑定操作优先级永远都高于在原型上的绑定操作优先级。因为构造器的 `this` 上下文指向的是实例自身，所以我们可以<span style="color:red">*在构造器内对核心内容执行初始化操作*</span>。

> 协调引用的过程：

> 1. 在引用对象的一个属性时，首先检查该对象本身是否拥有该属性，如果有，则直接返回，如果没有......

> 2. 则，再查看对象的原型，检查该原型上是否有所有的属性，如果有，则直接返回，如果没有......

> 3. 则，该值是 `undefined`

- JavaScript 中的每个对象，都有一个名为 `contructor` 的隐式属性，该属性引用的是创建该对象的构造器。由于 `prototype` 是构造器的一个属性，所以每个对象都有一种方式可以找到自己的原型。

### <p style="background:#orange;">探索原型</p>

	function Ninja() {};

	var ninja = new Ninja();

	var ninja2 = new ninja.constructor();

创建一个原型链最好的方式是，使用一个对象的实例作为另外一个对象的原型。
	
	subClass.prototype = new SuperClass();

所有原生 JavaScript 对象构造器（如 `Object`、`Array`、`String`、`Number`、`RegExp`、`Function`）都有可以被操作和扩展的原型属性——>因为每个对象构造器自身就是一个函数。

### <p style="background:#orange;">利用原型实现对象的扩展&&避免常见的问题</p>

陷阱：

1.**扩展原型**：扩展原生 `Object.prototype` 时，所有的对象都会接收这些额外的属性。

> 解决方法：`hasOwnProperty()`

2.**扩展数字**：用 `数字变量` 和 `数字表达式` 都可以，但是直接用 `数字字面量` 会报错，语法解析器不能处理字面量这种情况。

	Number.prototype.add = function(num) { return this + num; }

	var n = 5;

	n.add(3);	// 8

	(6).add(3); // 9

	6.add(3);	// Uncaught SyntaxError

> 一般来说，除非我们真的需要，最好避免在 Number 的原型上做扩展。

3.**子类化原生对象**：浏览器问题，IE下实现不能很好的反应某些属性值（如	`length`）

4.**实例化问题**：

> 函数有2种用途：（1）作为“普通”的函数；（2）作为构造器。

> 命名约定：函数作为构造器的时候，其名称以一个大写字符开头。

### <p style="background:#orange;">构建可继承的类</p>

:(