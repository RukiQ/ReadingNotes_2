### <p style="background:orange;">一、同步方法与异步方法</p>
 
在 Node.js 中，使用 fs 模块来实现所有有关文件及目录的创建、写入及删除操作。

在 fs 模块中，所有对文件及目录的操作都可以使用同步（`readFileSync`）与异步（`readFile`）这两种方法。在大多数情况下，应调用异步方法。

### <p style="background:orange;">二、对文件执行读写操作</p>

1. <span style="color:#ac4a4a">**文件的完整读写**</span>

	读取文件：
		
		fs.readFile(filename, [options], function (err, data) {});

	> options 参数值为一个对象，指定读取文件时需要使用的选项，可以使用 flag 属性

	写入文件：

		fs.writeFile(filename, data, [options], function (err) {});

	> options 参数值为一个对象，指定写入文件时需要使用的选项，可以使用 flag、mode、encoding 属性

	追加字符串或缓存区到文件底部：

		fs.appendFile(filename, data, [options], function (err) {});

2. <span style="color:#ac4a4a">**从指定位置处开始读写文件**</span>

	首先，打开文件：

		☛ fs.open(filename, flags, [mode], callback);

		// 回调函数代码
		➷ function (err, fd) {
			// fd：代表打开文件时返回的文件描述符
		}

	然后，在回调函数中调用 read 方法或 write 方法进行读写：

	读：

		☛ fs.read(fd, buffer, offset, length, position, callback);

		// 回调函数代码
		➷ function (err, bytesRead, buffer) {
			// bytesRead：代表实际读取的字节数
			// buffer：为被读取的缓存区对象
		}

		// 例子：
		var fs = require('fs');
		fs.open('./info.log', 'r', function(err, fd) {
		    var buf = new Buffer(255);
		    fs.read(fd, buf, 0, 9, 3, function(err, bytesRead, buffer) {
		        console.log(buffer.slice(0, bytesRead).toString());
		    });
		});

	写：

		☛ fs.write(fd, buffer, offset, length, position, callback)

		// 回调函数代码
		➷ function (err, written, buffer) {}

		// 例子：
		var fs = require('fs');
		var buf = new Buffer('I love node');
		fs.open('./test.txt', 'w', function(err, fd) {
		    fs.write(fd, buf, 0, 9, 3, function(err, writter, buffer) {
		        if (err) console.log('写入文件操作失败。');
		        console.log('写文件操作成功。');
		    });
		});

	最后，关闭文件：

		fs.close(fd);

	> 可以使用 `fs.fsync(fd, [callback]);` 方法进行同步操作
		
### <p style="background:orange;">三、创建与读取目录</p>

1. <span style="color:#ac4a4a">**创建目录**</span>

		fs.mkdir(path, [mode], callback)

		// eg:
		var fs = require('fs');

		fs.mkdir('./test', function(err) {
		    if (err) console.log('创建目录操作失败。');
		    else console.log('创建目录操作成功');
		})


2. <span style="color:#ac4a4a">**读取目录**</span>

		fs.readdir(path, function(err, files) {})

### <p style="background:orange;">四、查看与修改文件或目录的信息</p>

1. <span style="color:#ac4a4a">**查看文件或目录信息**</span>

		fs.stat(path, callback)
		fs.lstat(path, callback)：当查看符号链接文件时，必须使用该方法

		// 回调函数
		➷ function(err, stats) {
			// stats 参数值为一个 fs.Stats 对象
		}

2. <span style="color:#ac4a4a">**检查文件或目录是否存在**</span>

		fs.exists(path, function(exists) {
			// exists 为布尔值
		})

3. <span style="color:#ac4a4a">**获取文件或目录的绝对路径**</span>

		fs.realpath(path, [cache], function(err, resolvePath) {
			// reslovePath 为获取到的文件或目录的绝对路径
		})

4. <span style="color:#ac4a4a">**修改文件访问时间及修改时间**</span>

		// atime 用于指定修改后的访问时间，mtime 用于指定修改后的修改时间
		fs.utimes(path, atime, mtime, function(err) {})

5. <span style="color:#ac4a4a">**修改文件或目录的读取权限**</span>

		fs.chmod(path, mode, function(err) {})

	在使用 open 方法打开文件并返回文件描述符后，可以使用 fs 模块中的 fchmod 方法修改文件的读写权限。

### <p style="background:orange;">五、可以对文件或目录执行的其他操作</p>

1. <span style="color:#ac4a4a">**移动文件或目录**</span>

		fs.renamne(oldPath, newPath, function(err) {})

2. <span style="color:#ac4a4a">**创建与删除文件的硬链接**</span>
		
		fs.link(srcpath, despath, function(err) {})
		fs.unlink(srcpath, despath, function(err) {})

3. <span style="color:#ac4a4a">**创建与查看符号链接**</span>

		fs.symlink(srcpath, dstpath, [type], function(err) {})

	创建了一个符号链接之后，可以进行查看：

		fs.readlink(path, functon(err, linkString) {})

4. <span style="color:#ac4a4a">**截断文件**</span>

		fs.truncate(filename, len, function(err) {})

	在使用 open 方法打开文件并返回文件描述符后，可以使用 ftruncate 方法截断文件：

		fs.ftruncate(fd, len, callback)

5. <span style="color:#ac4a4a">**删除空目录**</span>

		fs.rmdir(path, function(err) {})

6. <span style="color:#ac4a4a">**监视文件或目录**</span>

		fs.watchFile(filename, [options], listener)
		
		// listener 即回调函数
		function（curr, prev) {
			// curr, prev 均为 fs.Stats 对象
		}

		// 取消监视
		fs.unwatchFile(filename, [listener])

	使用 watch 方法对文件或目录进行监视，该方法返回一个 fs.FSWatcher 对象

		var watcher = fs.watch(filename, [options], [listener])

		// [listenr]
		functon(event, filename) {}

		// 停止监视
		watcher.close()

### <p style="background:orange;">六、使用文件流</p>

1. <span style="color:#ac4a4a">**流的基本概念**</span>

	在使用 `readFile/readFileSync` 或 `writeFile/writeFileSync` 方法时，Node.js 将该文件内容视为一个整体，为其分配缓存区并且一次性将文件内容读取到缓存区中，在这个期间，Node.js 将不能执行任何其他处理。

	**应用场景：**在很多场合下，我们并不关心整个文件的内容，而只关注是否从文件中读取到了某些数据，以及在读取到这些数据时所需要执行的处理，这时，可以使用 Node.js 中的文件流来执行这一处理。	

2. <span style="color:#ac4a4a">**使用 ReadStream 对象读取文件**</span>

3. <span style="color:#ac4a4a">**使用 WriteStream 对象写入文件**</span>

### <p style="background:orange;">七、对路径进行操作</p>


