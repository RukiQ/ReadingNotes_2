[@by Ruth92](http://www.cnblogs.com/Ruth92/)（转载请注明出处）

## 第8章 构建Web应用


#### <p style="background:orange;">一、基础功能</p>

1. <span style="color:#ac4a4a">**请求方法**</span>：GET、POST、HEAD、DELETE、PUT、CONNECT

		GET /path?foo=bar HTTP/1.1

	HTTP_Parser 在解析请求报文的时候，将报文头抽取出来，设置成 `req.method`。

2. <span style="color:#ac4a4a">**路径解析**</span>

		GET /path?foo=bar HTTP/1.1

	HTTP_Parser 将其解析为 `req.url`

	一个完整的URL地址：

		http://user:pass@host.com:8080/p/a/t/h?query=string#hash

	客户端代理（浏览器）会将这个地址解析成报文，将路径和查询部分放在报文第一行。hash 部分会被丢弃，不会存在于报文的任何地方。

3. <span style="color:#ac4a4a">**查询字符串**</span>

		var query = url.parse(req.url, true).query;

4. <span style="color:#ac4a4a">**Cookie**</span>

	HTTP是无状态的协议，现实中的业务却是需要一定的状态的，否则无法区分用户之间的身份。

	Cookie 能记录服务器与客户端之间的状态，最早的用处就是用来判断用户是否第一次访问网站。

	**① 初识 Cookie**

	Cookie 的处理分为如下几步：

	- 服务器向客户端发送 Cookie;
	- 浏览器将 Cookie 保存；
	- 之后每次浏览器都会将 Cookie 发向服务器端。

	**② Cookie 的性能影响**

	- 减少 Cookie 的大小
	- 为静态组件使用不同的域名：不仅可以减少无效 Cookie 的传输，还可以突破浏览器下载线程数量的限制
	- 减少 DNS 查询

	> 减少 DNS 查询和使用不同的域名是冲突的两条规则，但好在现今的浏览器都会进行 DNS 缓存，以削弱这个副作用的影响。

5. <span style="color:#ac4a4a">**Session**</span>

	Cookie 的 <span style="color:red;">缺点</span>：数据可以在前后端进行修改。

	为了解决 Cookie 敏感数据的问题，Session 应运而生。Session 的数据只保留在服务器端，客户端无法修改，这样数据的安全性得到一定的保障，数据也无需再协议中每次都被传递。

	**☛ 将每个客户和服务器中的数据一一对应起来的实现方式：**

	 第一种：基于 Cookie 来实现用户和数据的映射

	- 一旦服务器端启用了Session，它将随意约定一个键值作为Session的口令；
	- 一旦服务器检查到用户请求Cookie中没有携带该值，它就会为之生成一个唯一且不重复的值，并设定超时时间；
	- 每个请求到来时，检查Cookie中的口令与服务器端的数据，如果过期，就重新生成。

	> 这种实现方案依赖Cookie实现，也是目前大多数Web应用的方案。如果客户端禁止使用Cookie，这个世界上大多数的网站将无法实现登录等操作。
	
	第二种：通过查询字符串来实现浏览器端和服务器端数据的对应

	- <span style="color:red;">原理</span>：检查请求的查询字符串，如果没有值，会先生成新的带值的URL
	- 有的服务器在客户端禁用Cookie时，会采用该方案实现退化，但是风险远大于基于Cookie的实现。

	**① Session 与内存**
	
	为了解决性能问题和Session数据无法跨进程共享的问题，常用的方案是将Session集中化，将原本可能分散在多个进程里的数据，统一转移到集中的数据存储中。

	尽管采用专门的缓存服务会比直接在内存中访问慢，但其影响小之又小，带来的好处却远远大于直接在Node中保存数据。

	**② Session 与安全**

	方案1：将口令通过私钥加密进行签名，使得伪造的成本较高；
	
	方案2：将客户端的某些独有信息与口令作为原值，然后签名，这样攻击者一旦不在原始的客户端上进行访问，就会导致签名失败。这些独有信息包括用户IP和用户代理。

6. <span style="color:#ac4a4a">**缓存**</span>

	通常来说，POST、DELETE、PUT这类带行为性的请求操作一般不做任何缓存，大多数缓存只应用在GET请求中。

	![图8-1 使用缓存的流程示意图](https://github.com/RukiQ/ReadingNotes/blob/master/%E3%80%8A%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BANode.js%E3%80%8B/img/%E5%9B%BE8-1%20%E4%BD%BF%E7%94%A8%E7%BC%93%E5%AD%98%E7%9A%84%E6%B5%81%E7%A8%8B%E7%A4%BA%E6%84%8F%E5%9B%BE.png?raw=true)

	☛ **条件请求**

	在普通的 GET 请求报文中，附带 **If-Mdified-Since** 字段。采用时间戳的方式。

	<span style="color:red;">缺陷</span>：时间戳有一定缺陷 →（1）文件的时间戳改动但内容并不一定改动；（2）时间戳只能精确到秒级别，更新频繁的内容将无法生效。

	<span style="color:red;">解决</span>：HTTP1.1 中引入 **Etag（Entity Tag）** 用以解决上述缺陷，由服务器生成。如果根据文件内容生成散列值，那么条件请求将不会受到时间戳改动造成的带宽浪费。

	与 **If-Modified-Since/Last-Modified** 不同的是，ETag 的请求和响应是 **If-None-Match/ETag**。

	> 尽管条件请求可以在文件内容没有修改的情况下节省带宽，但是它依然会发起一个HTTP请求，使得客户端依然会花一定时间来等待响应。
	> 
	> 可见最好的方案就是连条件请求都不用发起。
	
	在响应里设置 **Expires** 或 **Cache-Control** 头，浏览器将根据该值进行缓存。

	☛ **清除缓存**（更新机制）

	（1） 每次发布，路径中跟随 Web 应用的版本号；
	
	（2） 每次发布，路径中跟随该文件内容的 hash 值。（更高效，更精准）
	
7. <span style="color:#ac4a4a">**Basic 认证**</span>

#### <p style="background:orange;">二、数据上传</p>

#### <p style="background:orange;">三、路由解析</p>

#### <p style="background:orange;">四、中间件</p>

![图8-4 中间件的工作模型](https://github.com/RukiQ/ReadingNotes/blob/master/%E3%80%8A%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BANode.js%E3%80%8B/img/%E5%9B%BE8-4%20%E4%B8%AD%E9%97%B4%E4%BB%B6%E7%9A%84%E5%B7%A5%E4%BD%9C%E6%A8%A1%E5%9E%8B.png?raw=true)

#### <p style="background:orange;">五、页面渲染</p>