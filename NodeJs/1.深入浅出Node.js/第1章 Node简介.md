[@by Ruth92](http://www.cnblogs.com/Ruth92/)（转载请注明出处）

## 第1章 Node简介

#### <p style="background:orange;">一、Node的起源</p>

高性能Web服务器的要点：事件驱动、非阻塞I/O。

选择JavaScript的原因：高性能、符合事件驱动、没有历史包袱。

- `JavaScript` 的开发门槛低；
- `JavaScritp` 无历史包袱，导入非阻塞I/O库没有额外阻力;
- `JavaScript` 在浏览器中有广泛的事件驱动方面的应用，满足基于事件驱动的需求；
- Chrome 浏览器的 `JavaScript` 引擎 V8 性能最佳。

Node与浏览器的对比：

![Chrome浏览器和Node的组件构成](https://github.com/RukiQ/ReadingNotes/blob/master/%E3%80%8A%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BANode.js%E3%80%8B/img/%E5%9B%BE1-1%20Chrome%E6%B5%8F%E8%A7%88%E5%99%A8%E5%92%8CNode%E7%9A%84%E7%BB%84%E4%BB%B6%E6%9E%84%E6%88%90.png?raw=true)

> 除了 HTML、WebKit 和显卡这些 UI 相关技术没有支持外，Node 的结构与 Chrome 十分相似。
> 
> 它们都是基于事件驱动的异步架构，浏览器通过事件驱动来服务界面上的交互，Node 通过事件驱动来服务 I/O。

#### <p style="background:orange;">二、Node的特点</p>

1) 异步 I/O

- 在 Node 中，我们可以从语言层面很自然地进行并行 I/O 操作。
- 每个调用之间无需等待之前的 I/O 调用结束。在编程模型上可以极大提升效率。

2) 事件与回调函数

- 回调函数式最好的接受异步调用返回数据的方式。

3) 单线程

Node 保持了 JavaScritp 在浏览器中单线程的特点。并且在 Node 中，JavaScript 与其余线程是无法共享任何状态的。

- 单线程的最大好处：
	- 不用像多线程编程那样处处在意状态的同步问题，这里没有死锁的存在，也没有线程上下文交换所带来的性能上的开销。
- 单线程的弱点：
	- 无法利用多核 CPU；
	- 错误会引起整个应用退出，应用的健壮性值得考验；
	- 大量计算占用 CPU 导致无法继续调用异步 I/O。

浏览器中 JavaScript 与 UI 共用一个线程，JavaScript 长时间执行会导致 UI 的渲染和响应被中断。

4) 跨平台

![Node基于libuv实现跨平台的架构示意图](https://github.com/RukiQ/ReadingNotes/blob/master/%E3%80%8A%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BANode.js%E3%80%8B/img/%E5%9B%BE1-4%20Node%E5%9F%BA%E4%BA%8Elibuv%E5%AE%9E%E7%8E%B0%E8%B7%A8%E5%B9%B3%E5%8F%B0.png?raw=true)

> 目前，libuv 已经成为许多系统实现跨平台的基础组件。

#### <p style="background:orange;">三、Node 的应用场景</p>

1) I/O 密集型

I/O 密集的优势：主要在于 Node 利用事件循环的处理能力，而不是启动每一个线程为每一个请求服务，资源占用极少。

2) CPU 密集型：

挑战：由于 JavaScript 单线程的原因，如果有长时间运行的计算（比如大循环），将会导致 CPU 时间片不能释放，使得后续 I/O 无法发起。

是否适用？——>只需做到合理调度或实现 C/C++ 扩展等

4) 与遗留系统的和平共处

5) 分布式应用：高效并行 I/O


