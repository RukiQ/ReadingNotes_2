## 一、Node.js 中的控制台

（1） `console.log` 方法：用于进行标准输出流的输出。

1：表示重定向标准输出流

	node app.js 1>info.log	// 将 app.js 中的内容输出到 info.log 文件中

（2）`console.error`/`console.warn` 方法：用于进行标准错误输出流的输出。

2：表示重定向标准错误输出流

（3）`console.time` 方法：标记开始时间；`console.timeEnd` 方法：标记结束时间

	console.time(label)
	console.tiemEnd(label)

（4）`console.trace` 方法：将当前位置处的栈信息作为标准错误进行输出
	
	console.trace(label)	// label 用于标识此处输出的标准错误信息

（5）`console.assert` 方法：用于对一个表达式的执行结果进行评估

## 二、Node.js中的全局作用域及全局函数

（1）全局对象：

- `global` 对象

（2）全局函数：

- `setTimeout` 和 `clearTimeout`
		
		setTimeout(cb, ms, [args], [...])

		var timer = setTimeout(testFunction, 5000, 'this is a parameter.');
		clearTimeout(timer);

- `setInterval` 和 `clearInterval`

		setInterval(cb, ms, [args], [...])

		var timer = setInterval(testFunction, 5000, 'this is a parameter.');
		clearInterval(timer);

- 定时器对象的 `unref` 方法与 `ref` 方法：用于取消 `setTimeout` 和 `setInterval` 函数中指定的回调函数的调用，会产生性能影响，谨慎使用。

		timer.unref();
		timer.ref();

（3）与模块相关的全局函数及对象：

- 使用 `require` 函数加载模块

	> 模块在首次加载后将缓存在内存缓存区中，即对于相同模块的多次引用得到的都是同一个模块对象，也即对于相同模块的多次引用不会引起模块内代码的多次执行。
	
- 使用 `require.resolve` 函数查询完整模块名（带有绝对路径）

- `require.cache` 对象：代表缓存了所有已被加载模块的缓存区

	> 当使用 `delete` 关键字删除缓存区中缓存的某个模块对象后，下次加载该模块时将重新运行该模块中的代码。

## 三、`__filename` 变量与 `__dirname` 变量

- 用于获取当前模块文件名（带有绝对路径）和当前目录名。

## 四、事件处理机制及事件环机制

（1） EventEmitter 类
	
- `addListener(event, listener)`

- `on(event, listener)`	// addListener 的别名

- `once(event, listener)`

- `removeListener(event, listener)`

- `removeAllListeners([even])`

- `setMaxListeners(n)`

- `listeners(event)`	// 获取指定事件的所有事件处理函数

- `emit(event, [arg1], [arg2], [...])`

（2） EventEmitter 类的各个方法

	var http = require('http');
	var server = http.createServer();
	
	// 当服务器接收到客户端请求时，执行回调函数进行输出
	server.on('request', function(req, res) {
	
	    /**
	     * 浏览器为页面在收藏夹中的显示图标（默认为favicon.ico）
	     * 如果不判断，也会输出 /favicon.ico
	     */
	    if (req.url !== '/favicon.ico') {
	        console.log(req.url);   // 输出用户输入的目标URL地址
	    }
	    
	    res.end();
	});
	
	// 可以通过多个 on 方法的执行来对同一个事件绑定多个事件处理函数
	server.on('request', function(req, res) {
	    if (req.url !== '/favicon.ico') {
	        console.log('发送响应完毕');
	    }
	    
	    res.end();
	});
	
	server.listen(1337, '127.0.0.1');

（3） 获取指定事件的事件处理函数的数量：`listenerCount` 方法

	EventEmitter.listenerCount(emitter, event)

使用：

	var http = require('http');
	var events = require('events');	// 引入 events 模块
	var server = http.createServer();
	
	server.on('request', function(req, res) {
	    if (req.url !== '/favicon.ico') {
	        console.log(req.url);   // 输出用户输入的目标URL地址
	    }
	    res.end();
	});
	
	server.on('request', function(req, res) {
	    if (req.url !== '/favicon.ico') {
	        console.log('发送响应完毕');
	    }
	    
	    res.end();
	});
	
	server.listen(1337, '127.0.0.1');

	console.log(events.EventEmitter.listenerCount(server, 'request'));	// 2

（4） EventEmitter 类自身所拥有的事件：`newListener` 事件与 `removeListener` 事件

> 任何时候，当对继承了 EventEmitter 类的子类实例对象绑定（取消）事件处理函数时，都将触发 EventEmitter 类的 newListener（removeListener）事件。

（5） 事件环机制

JavaScript 是单线程，因此一个时刻只能执行一个回调函数，Node 也是单线程，使用的是非阻塞 I/O，所以它对于每个回调函数的执行速度将会是非常快的，因为它并不需要等待任何 I/O 处理的结束。

事件环机制：在回调函数的执行过程中，他将转而处理新的事件，在该事件处理完毕之后，转而继续处理原回调函数。这种环状处理机制，在 Node.js 中称为事件环机制。

## 五、在 Node.js 中使用调试器

- 在命令行窗口中使用调试器

	`node debug <需要被执行的脚本文件名>`

	`cont/continue/c`：继续剩余脚本代码的执行

	`next/n`：将程序执行到下一句可执行代码之前

	`step/s`：进入函数内部

	`out/o`：执行完函数剩余的所有代码

- 观察变量值或表达式的执行结果

	`watch`：查看某个

	`watchers`：查看所有

	`unwatch`：解除观察

- 设置与取消断点

		setBreakpoint(filename, list) 或
		
		sb(filename, line)

- 调试器中可以使用的其他实用命令

	`backtrace/bt`：查看该函数及其外层各函数的返回位置

	`list`：查看当前所要执行代码之前及之后的几行代码

	`repl`：进入 REPL 运行环境

	`restart`：重新开始脚本的调试

	`kill`：终止脚本文件的调试

	`run`：kill 之后重新开始脚本文件的调试

	`scripts`：查看当前正在运行的文件及所有被加载的模块文件名称

	`version`：查看 V8 引擎版本号

- 使用 node-inspector 调试工具

	npm install -g node-inspector