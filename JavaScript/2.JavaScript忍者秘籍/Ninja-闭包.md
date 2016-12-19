## 闭包

### <p style="background:orange;">闭包是什么，它们是如何工作的</p>

> <span style="color:red;">**闭包**</span> 是一个函数在创建时允许该自身函数访问并操作该自身函数之外的变量时所创建的**作用域**。

> 即：闭包可以让函数访问所有的变量和函数，只要这些变量和函数存在于该函数声明时的作用域内就行。

<span style="background:yellow">一个简单的闭包：</span>

	/* 分析：在同一个作用域内声明一个变量和函数，`outerFunction`可以看到并访问`outerValue`。
	 * 此处是全局作用域，该作用域实际上就是一个闭包，从未消失过（因为页面已经被加载了）。
	 */

	var outerValue = "ninja";
	
	function outerFunction() {
		alert(outerValue);
	}
	
	outerFunction();	// ninja

<span style="background:yellow">更深入的闭包：</span>

	var outerValue = "ninja";
	var later;	// 声明一个全局变量
	
	function outerFunction() {
		// 在函数内部声明一个值。该变量的作用域是限制在该函数内部，并且在函数外部访问不到
		var innerValue = "samurai";
	
		// 在外部函数内，声明一个内部函数。注意，声明该函数时，innerValue是在作用域内的。
		function innerFunction() {	
			alert(outerValue);
			alert(innerValue);
		}
	
		later = innerFunction;	// 将内部函数引用到later变量上
	}
	
	/* 调用外部函数，将会声明内部函数，并将内部函数赋值给later变量
	 * 但并不输出
	 */
	outerFunction();	
	
	/* 通过later调用内部函数
	 *不能直接调用内部函数，因为它的作用域（和innerValue一起）被限制在outerFunction()内
	 */
	later();	// ninja,samurai

###### * 分析：

- 当调用 `later` 执行内部函数时，外部函数的作用域早已不复存在，但是 `innerValue` 变量仍然“活着”，这要归功于闭包。

- 在外部函数中声明 `innerFunction()` 的时候，不仅是声明了函数，还<span style="background:yellow">创建了一个闭包</span>。该闭包不仅包含函数声明，还包含了函数声明的那一时刻点上该作用域中的所有变量。

- 针对在函数声明那一时刻点的作用域内的所有函数和变量，闭包创建了一个<span style="color:red;">“安全气泡”</span>，因此函数获得了执行操作所需的所有东西。

![closure](https://github.com/RukiQ/blog-learning-patch/blob/master/JS-JSNinja/img/closure.png?raw=true)

<span style="background:yellow">闭包的三个有趣的概念：</span>

1. 内部函数的参数是包含在闭包中的。
2. 作用域之外的所有变量，即便是函数声明之后的那些声明，也都包含在闭包中。
3. 相同的作用域内，尚未声明的变量不能进行提前引用。

*例子：*

	var outerValue = "ninja";
	var later;
	
	function outerFunction() {
		var innerValue = "samurai";
	
		function innerFunction(paramValue) {
			console.log(outerValue);
			console.log(innerValue);
			console.log(paramValue);
			console.log(tooLate);
		}
	
		later = innerFunction;
	}
	
	console.log(tooLate);	// undefined
	
	var tooLate = "ronin";
	
	outerFunction();	
	
	later('wakizashi');		// ninja,samurai,wakizashi,ronin

### <p style="background:orange;">利用闭包简化开发</p>

**闭包的常见用法：**

- <span style="color:red;">*私有变量* </span>：封装一些信息作为“私有变量”，即，限制这些变量的作用域。

		function Ninja() {
			var age = 10;
		
			this.getAge = function() {
				return age;
			}
		
			this.setAge = function() {
				age++;
			}
		}

		var ninja = new Ninja();
		ninja.setAge();
		ninja.getAge();	// 11

- <span style="color:red;">*回调与计时器* </span>： 在这种情况下，函数都是在后期未指定的时间进行异步调用，在这种函数内部，我们经常需要访问外部数据，闭包可以作为一种访问这些数据的很直观的方式，特别是当我们希望避免创建全局变量来存储这些信息时。

		// 示例1：在 Ajax 请求的 callback 里使用闭包
		jQuery('#testButton').click(function() {
			var elem$ = jQuery('#testSubject');
		
			elem$.html("Loading...");
		
			jQuery.ajax({
				url: "test.html",
				success: function(html) {	// 通过闭包引用了elem$变量
					console.log(elem$);
					elem$.html(html);
				}
			});
		});

		// 示例2：在计时器间隔回调中使用闭包
		function animateIt(elementId) {
		
			var elem = document.getElementById(elementId);
			var tick = 0;
		
			var timer = setInterval(function() {
				if (tick < 100) {
					elem.style.left = elem.style.top = tick + "px";
					tick++;
				} else {
					clearInterval(timer);
					console.log(tick == 100);
					console.log(elem);
					console.log(timer);
				}
			}, 10);
		}
		
		animateIt('box');

> 没有闭包，同时做多件事情的时候，无论是事件处理，还是动画，甚至是 Ajax 请求，都将是及其困难的。

> 函数在闭包里执行的时候，不仅可以在闭包创建的时刻点上看到这些变量的值，我们还可以对其进行更新。换句话说，闭包不仅是在创建那一时刻点的状态的快照，而且是一个真实的状态封装，只要闭包存在，就可以对其进行修改。

### <p style="background:orange;">利用闭包提高性能&&解决常见的作用域问题</p>

1.**绑定函数上下文**

 `bind`：

> Prototype 的 `bind()`（或者是我们自己实现的），并不意味着它是 `apply()` 或 `call()` 的一个替代方法，该方法的*潜在目的* 是通过匿名函数和闭包控制后续执行的上下文。这个重要的区别使 `apply()` 或 `call()` 对事件处理程序和定时器的回调进行延迟执行特别有帮助。

2.**偏应用函数**

`柯里化`：在一个函数中首先填充几个参数（然后再返回一个新函数）的技术。

3.**函数重载**

（1）缓存记忆

（2）函数包装

4.**即时函数**

`即时函数（立即执行函数）`：依赖于对闭包的充分利用。

	(function() {
		statement..;
	})();

> - 创建一个函数实例。

> - 执行该函数。

> - 销毁该函数（因为语句结束以后，，没有任何引用了）。

<span style="color:red;">**即时函数的用处：**</span>

###### <span style="background:yellow;">- 临时作用域和私有变量</span>

（1）创建一个独立作用域：

> 利用即时函数，我们可以利用其内部作用域来创建一个临时的作用域，用于存储数据状态。

> 记住，JavaScript 中的作用域依赖于定义变量的函数。在很多编程语言中，作用域是依赖于代码块的，但在 JavaScript 中，变量的作用域依赖于变量所在的闭包。

	// method 1	
	(function() {
		var numClicks = 0;
		document.addEventListener("click", function(){
			alert( ++numClicks );
		},false);
	})();
	
	// method 2
	document.addEventListener("click", (function() {
		var numClicks = 0;
		return function() {
			alert( ++numClicks );
		}
	})(), false);

- 这是一种最常见的即时函数使用方式：简单，自包装功能。各功能所需的变量都保存在闭包内，但对其他地方却都不可见。

（2）通过参数限制作用域内的名称

	(function(what) {
		alert(what);
	})('Hi there!');

（3）使用简洁名称让代码保持可读性

	(function(v) {
		Object.extend(v, {
			href: v._getAttr,
			src:  v._getAttr,
			...
		});
	})(Element.attributeTranslations.read.values);

> 这种在作用域内创建临时变量的技巧，对没有延迟调用的循环遍历来说尤其有用。

###### <span style="background:yellow;">- 循环</span>

> 闭包记住的是变量的引用，而不是闭包创建时刻该变量的值。

	var div = document.getElementsByTagName("div");
	
	for (var i=0; i < div.length; i++) {
		(function(n) {
			div[n].addEventListener("click", function() {
				alert("div #" + n + " was clicked.");
			}, false);
		})(i);
	}

###### <span style="background:yellow;">- 类库包装</span>

> 闭包和即时函数可以帮助我们让类库尽可能的保持私有，并且可以选择性的让一些变量暴露到全局命名空间内。

	// method 1
	(function() {
		var jQuery = window.jQuery = function() {
			// Initialize
		};

		// ...
	})();

	// method 2
	var jQuery = (function() {
		function jQuery() {
			// Initialize
		}

		// ...

		return jQuery;
	})();