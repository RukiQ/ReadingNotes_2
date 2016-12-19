### 一、创建 Buffer 对象

方法1：

	var buf = new Buffer(size);
	buf.fill(value, [offset], [end]);	// 初始化缓存区中的所有内容

方法2：

	var buf = new Buffer(array);	// 直接用一个数组来初始化缓存区

方法3：

	// 直接使用一个字符串来初始化缓存区，encoding 默认为 "utf8"
	var buf = new Buffer(str, [encoding]);	

### 二、字符串的长度与缓存区的长度

- 字符串的长度以文字为单位，缓存区的长度以字节为单位；

- 字符串对象一旦创建后不可被修改，Buffer对象可以被修改；

- 字符串对象拥有可用于搜索字符的 indexOf 方法、match 方法、search 方法等，Buffer 对象只有 slice 方法，并且如果修改 slice 取出的数据，则缓存区中保存的额数据也将被更改，因为共享内存区域。

### 三、Buffer 对象与字符串对象之间的相互转换

1. Buffer 对象的 `toString` 方法（从缓冲区读取数据）
	
		buf.toString([encoding[, start[, end]]])

2. Buffer 对象的 `write` 方法（写入缓冲区）

		buf.write(string[, offset[, length]][, encoding])

3. `StringDecoder` 对象：与 `toString` 方法相同，但对于 utf8 编码格式的字符串提供更好的支持。

		// 首先需要加载 Node.js 中的 string_decoder 模块
		var StringDecoder = require('string_decoder').StringDecoder;
		var decoder = new StringDecoder([encoding]);
		decoder.write(buffer);

	> 用处：当需要将多个 Buffer 对象中的二进制数据转换为文字的场合。

### 四、Buffer 对象与数值对象之间的相互转换

参看 [菜鸟教程-Node.js Buffer缓冲区](http://www.runoob.com/nodejs/nodejs-buffer.html)

### 五、Buffer 对象与 JSON 对象之间的相互转换

1. `JSON.stringify` 方法
2. `JSON.parse` 方法
3. `toJSON` 方法

		var buf = new Buffer('我喜爱编程');
		var json = JSON.stringify(buf);
		JSON.parse(json);
		buf.toJSON();

### 六、复制缓存数据

	buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])

### 七、Buffer 类的类方法

1. isBuffer 方法：判断对象是否为一个 Buffer 对象

		Buffer.isBuffer(obj);

2. byteLenght 方法：计算一个指定字符串的字节数

		Buffer.byteLength(string, [encoding]);

3. concat 方法：将几个 Buffer 对象结合创建一个新的 Buffer 对象

		Buffer.concat(list[, totalLength])

4. isEncoding 方法：检测一个字符串是否为一个有效的编码格式字符串

		Buffer.isEncoding(encoding);

		Buffer.isEncoding('utf8');	// true
		Buffer.isEncoding('utf');	// false
